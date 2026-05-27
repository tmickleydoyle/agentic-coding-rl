"""Bundled, offline single-turn coding tasks (rung 1).

Each task is self-contained: a natural-language prompt, the expected function name
(`entry_point`), a list of independent test snippets (so reward can be a *fraction*
of tests passing, not just pass/fail), and a `canonical_solution` used by the unit
tests to validate the sandbox + reward harness without a GPU.

These exist so the full RL loop is runnable with zero downloads. For real runs,
`build_tasks.py` can additionally pull MBPP+/HumanEval+ via the `datasets` library.
"""

BUNDLED_TASKS = [
    {
        "task_id": "bundled/add_two",
        "split": "train",
        "prompt": "Write a Python function `add_two(a, b)` that returns the sum of two integers a and b.",
        "entry_point": "add_two",
        "tests": [
            "assert add_two(1, 2) == 3",
            "assert add_two(-5, 5) == 0",
            "assert add_two(0, 0) == 0",
            "assert add_two(100, 250) == 350",
        ],
        "canonical_solution": "def add_two(a, b):\n    return a + b\n",
    },
    {
        "task_id": "bundled/is_even",
        "split": "train",
        "prompt": "Write a Python function `is_even(n)` that returns True if the integer n is even, otherwise False.",
        "entry_point": "is_even",
        "tests": [
            "assert is_even(2) is True",
            "assert is_even(3) is False",
            "assert is_even(0) is True",
            "assert is_even(-4) is True",
        ],
        "canonical_solution": "def is_even(n):\n    return n % 2 == 0\n",
    },
    {
        "task_id": "bundled/reverse_string",
        "split": "train",
        "prompt": "Write a Python function `reverse_string(s)` that returns the reverse of the string s.",
        "entry_point": "reverse_string",
        "tests": [
            "assert reverse_string('abc') == 'cba'",
            "assert reverse_string('') == ''",
            "assert reverse_string('a') == 'a'",
            "assert reverse_string('racecar') == 'racecar'",
        ],
        "canonical_solution": "def reverse_string(s):\n    return s[::-1]\n",
    },
    {
        "task_id": "bundled/factorial",
        "split": "train",
        "prompt": "Write a Python function `factorial(n)` that returns n! for a non-negative integer n. factorial(0) is 1.",
        "entry_point": "factorial",
        "tests": [
            "assert factorial(0) == 1",
            "assert factorial(1) == 1",
            "assert factorial(5) == 120",
            "assert factorial(6) == 720",
        ],
        "canonical_solution": "def factorial(n):\n    result = 1\n    for i in range(2, n + 1):\n        result *= i\n    return result\n",
    },
    {
        "task_id": "bundled/fib",
        "split": "train",
        "prompt": "Write a Python function `fib(n)` that returns the n-th Fibonacci number (0-indexed), where fib(0)=0, fib(1)=1.",
        "entry_point": "fib",
        "tests": [
            "assert fib(0) == 0",
            "assert fib(1) == 1",
            "assert fib(10) == 55",
            "assert fib(15) == 610",
        ],
        "canonical_solution": "def fib(n):\n    a, b = 0, 1\n    for _ in range(n):\n        a, b = b, a + b\n    return a\n",
    },
    {
        "task_id": "bundled/max_of_list",
        "split": "train",
        "prompt": "Write a Python function `max_of_list(xs)` that returns the largest number in a non-empty list xs.",
        "entry_point": "max_of_list",
        "tests": [
            "assert max_of_list([1, 2, 3]) == 3",
            "assert max_of_list([-1, -2, -3]) == -1",
            "assert max_of_list([42]) == 42",
            "assert max_of_list([5, 5, 5]) == 5",
        ],
        "canonical_solution": "def max_of_list(xs):\n    best = xs[0]\n    for x in xs[1:]:\n        if x > best:\n            best = x\n    return best\n",
    },
    {
        "task_id": "bundled/count_vowels",
        "split": "train",
        "prompt": "Write a Python function `count_vowels(s)` that returns the number of vowels (a, e, i, o, u, case-insensitive) in the string s.",
        "entry_point": "count_vowels",
        "tests": [
            "assert count_vowels('hello') == 2",
            "assert count_vowels('xyz') == 0",
            "assert count_vowels('AEIOU') == 5",
            "assert count_vowels('') == 0",
        ],
        "canonical_solution": "def count_vowels(s):\n    return sum(1 for c in s.lower() if c in 'aeiou')\n",
    },
    {
        "task_id": "bundled/is_palindrome",
        "split": "train",
        "prompt": "Write a Python function `is_palindrome(s)` that returns True if the string s reads the same forwards and backwards, else False.",
        "entry_point": "is_palindrome",
        "tests": [
            "assert is_palindrome('racecar') is True",
            "assert is_palindrome('hello') is False",
            "assert is_palindrome('') is True",
            "assert is_palindrome('aa') is True",
        ],
        "canonical_solution": "def is_palindrome(s):\n    return s == s[::-1]\n",
    },
    {
        "task_id": "bundled/gcd",
        "split": "train",
        "prompt": "Write a Python function `gcd(a, b)` that returns the greatest common divisor of two positive integers a and b.",
        "entry_point": "gcd",
        "tests": [
            "assert gcd(12, 8) == 4",
            "assert gcd(17, 5) == 1",
            "assert gcd(100, 10) == 10",
            "assert gcd(7, 7) == 7",
        ],
        "canonical_solution": "def gcd(a, b):\n    while b:\n        a, b = b, a % b\n    return a\n",
    },
    {
        "task_id": "bundled/sum_list",
        "split": "test",
        "prompt": "Write a Python function `sum_list(xs)` that returns the sum of all numbers in the list xs. The sum of an empty list is 0.",
        "entry_point": "sum_list",
        "tests": [
            "assert sum_list([1, 2, 3]) == 6",
            "assert sum_list([]) == 0",
            "assert sum_list([-1, 1]) == 0",
            "assert sum_list([10]) == 10",
        ],
        "canonical_solution": "def sum_list(xs):\n    total = 0\n    for x in xs:\n        total += x\n    return total\n",
    },
    {
        "task_id": "bundled/fizzbuzz",
        "split": "test",
        "prompt": (
            "Write a Python function `fizzbuzz(n)` that returns a list of strings for i from 1 to n "
            "inclusive: 'Fizz' if i is divisible by 3, 'Buzz' if divisible by 5, 'FizzBuzz' if divisible "
            "by both, otherwise the string of i."
        ),
        "entry_point": "fizzbuzz",
        "tests": [
            "assert fizzbuzz(1) == ['1']",
            "assert fizzbuzz(3) == ['1', '2', 'Fizz']",
            "assert fizzbuzz(5) == ['1', '2', 'Fizz', '4', 'Buzz']",
            "assert fizzbuzz(15)[-1] == 'FizzBuzz'",
        ],
        "canonical_solution": (
            "def fizzbuzz(n):\n"
            "    out = []\n"
            "    for i in range(1, n + 1):\n"
            "        if i % 15 == 0:\n"
            "            out.append('FizzBuzz')\n"
            "        elif i % 3 == 0:\n"
            "            out.append('Fizz')\n"
            "        elif i % 5 == 0:\n"
            "            out.append('Buzz')\n"
            "        else:\n"
            "            out.append(str(i))\n"
            "    return out\n"
        ),
    },
    {
        "task_id": "bundled/second_largest",
        "split": "test",
        "prompt": "Write a Python function `second_largest(xs)` that returns the second largest distinct value in a list of at least two distinct numbers.",
        "entry_point": "second_largest",
        "tests": [
            "assert second_largest([1, 2, 3]) == 2",
            "assert second_largest([5, 1]) == 1",
            "assert second_largest([10, 10, 9]) == 9",
            "assert second_largest([-1, -2, -3]) == -2",
        ],
        "canonical_solution": "def second_largest(xs):\n    distinct = sorted(set(xs), reverse=True)\n    return distinct[1]\n",
    },
]
