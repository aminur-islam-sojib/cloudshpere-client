import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BarChart3, Download } from "lucide-react";

const ReportsPage = () => {
  const reports = [
    {
      id: 1,
      name: "Monthly Sales Report",
      date: "Dec 1, 2025",
      status: "Ready",
      size: "2.4 MB",
    },
    {
      id: 2,
      name: "User Activity Report",
      date: "Dec 5, 2025",
      status: "Ready",
      size: "1.8 MB",
    },
    {
      id: 3,
      name: "Financial Overview",
      date: "Dec 8, 2025",
      status: "Generating",
      size: "-",
    },
    {
      id: 4,
      name: "Quarterly Analysis",
      date: "Dec 10, 2025",
      status: "Ready",
      size: "3.2 MB",
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
          Reports
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          View and download your business reports.
        </p>
      </div>

      <Card className="border-slate-200 dark:border-slate-700 mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Generate New Report
          </CardTitle>
          <CardDescription>
            Create a custom report for your needs
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                Report Type
              </label>
              <select className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white">
                <option>Sales Report</option>
                <option>User Report</option>
                <option>Financial Report</option>
                <option>Custom Report</option>
              </select>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                  From Date
                </label>
                <input
                  type="date"
                  className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                  To Date
                </label>
                <input
                  type="date"
                  className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>
            </div>
            <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
              Generate Report
            </button>
          </div>
        </CardContent>
      </Card>

      <Card className="border-slate-200 dark:border-slate-700">
        <CardHeader>
          <CardTitle>Recent Reports</CardTitle>
          <CardDescription>Your generated reports</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700">
                  <th className="text-left py-3 px-4 font-semibold text-slate-900 dark:text-white">
                    Name
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-900 dark:text-white">
                    Date
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-900 dark:text-white">
                    Status
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-900 dark:text-white">
                    Size
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-900 dark:text-white">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {reports.map((report) => (
                  <tr
                    key={report.id}
                    className="border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                  >
                    <td className="py-3 px-4 text-slate-900 dark:text-white">
                      {report.name}
                    </td>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-400">
                      {report.date}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                          report.status === "Ready"
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                            : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                        }`}
                      >
                        {report.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-400">
                      {report.size}
                    </td>
                    <td className="py-3 px-4">
                      {report.status === "Ready" && (
                        <button className="flex items-center gap-2 px-3 py-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded transition-colors">
                          <Download className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                          <span className="text-sm text-slate-600 dark:text-slate-400">
                            Download
                          </span>
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportsPage;
