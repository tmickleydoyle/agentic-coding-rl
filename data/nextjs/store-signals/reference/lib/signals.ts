export interface Signal<T> {
  get(): T;
  set(value: T): void;
}

export interface Computed<T> {
  get(): T;
}

// A consumer is anything that reads reactive values and needs to know when they
// change: a computed or an effect. Each consumer records the producers it read.
interface Consumer {
  // Called to invalidate the consumer. For a computed this marks it dirty; for an
  // effect it schedules a re-run.
  invalidate(): void;
  // Producers this consumer currently depends on (so we can unsubscribe on rerun).
  deps: Set<Producer>;
}

interface Producer {
  dependents: Set<Consumer>;
}

// Read-tracking stack: the innermost currently-running consumer is on top.
const consumerStack: Consumer[] = [];

function currentConsumer(): Consumer | undefined {
  return consumerStack.length > 0 ? consumerStack[consumerStack.length - 1] : undefined;
}

function trackRead(producer: Producer): void {
  const consumer = currentConsumer();
  if (!consumer) return;
  producer.dependents.add(consumer);
  consumer.deps.add(producer);
}

function clearDeps(consumer: Consumer): void {
  consumer.deps.forEach((producer) => {
    producer.dependents.delete(consumer);
  });
  consumer.deps.clear();
}

function runTracked<T>(consumer: Consumer, fn: () => T): T {
  clearDeps(consumer);
  consumerStack.push(consumer);
  try {
    return fn();
  } finally {
    consumerStack.pop();
  }
}

// Batching: collect effects invalidated during a synchronous update and flush
// each exactly once, so diamond dependencies do not double-fire.
let batchDepth = 0;
const pendingEffects: Set<EffectNode> = new Set();

function batch(fn: () => void): void {
  batchDepth++;
  try {
    fn();
  } finally {
    batchDepth--;
    if (batchDepth === 0) {
      flush();
    }
  }
}

function flush(): void {
  while (pendingEffects.size > 0) {
    const effects = Array.from(pendingEffects);
    pendingEffects.clear();
    for (let i = 0; i < effects.length; i++) {
      const e = effects[i];
      if (!e.disposed) e.run();
    }
  }
}

class SignalNode<T> implements Signal<T>, Producer {
  dependents: Set<Consumer> = new Set();
  private value: T;

  constructor(initial: T) {
    this.value = initial;
  }

  get(): T {
    trackRead(this);
    return this.value;
  }

  set(value: T): void {
    if (Object.is(value, this.value)) return;
    this.value = value;
    const deps = Array.from(this.dependents);
    batch(() => {
      for (let i = 0; i < deps.length; i++) {
        deps[i].invalidate();
      }
    });
  }
}

class ComputedNode<T> implements Computed<T>, Producer, Consumer {
  dependents: Set<Consumer> = new Set();
  deps: Set<Producer> = new Set();
  private dirty = true;
  private value!: T;

  constructor(private fn: () => T) {}

  invalidate(): void {
    if (this.dirty) return;
    this.dirty = true;
    // Propagate invalidation to our own dependents.
    const deps = Array.from(this.dependents);
    for (let i = 0; i < deps.length; i++) {
      deps[i].invalidate();
    }
  }

  get(): T {
    if (this.dirty) {
      this.value = runTracked(this, this.fn);
      this.dirty = false;
    }
    trackRead(this);
    return this.value;
  }
}

class EffectNode implements Consumer {
  deps: Set<Producer> = new Set();
  disposed = false;
  private scheduled = false;

  constructor(private fn: () => void) {
    this.run();
  }

  invalidate(): void {
    if (this.disposed) return;
    if (this.scheduled) return;
    this.scheduled = true;
    pendingEffects.add(this);
  }

  run(): void {
    if (this.disposed) return;
    this.scheduled = false;
    pendingEffects.delete(this);
    runTracked(this, this.fn);
  }

  dispose(): void {
    if (this.disposed) return;
    this.disposed = true;
    pendingEffects.delete(this);
    clearDeps(this);
  }
}

export function signal<T>(initial: T): Signal<T> {
  return new SignalNode(initial);
}

export function computed<T>(fn: () => T): Computed<T> {
  return new ComputedNode(fn);
}

export function effect(fn: () => void): () => void {
  const node = new EffectNode(fn);
  return () => node.dispose();
}
