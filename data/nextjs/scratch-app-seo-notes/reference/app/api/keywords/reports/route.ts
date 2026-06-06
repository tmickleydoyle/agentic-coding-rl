import { getReports, generateReport } from "../../../../lib/store";

export function GET() { return Response.json({ reports: getReports() }); }

export function POST() {
  const report = generateReport();
  return Response.json({ report }, { status: 201 });
}
