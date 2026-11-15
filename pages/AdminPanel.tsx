
import React from 'react';

const AdminPanel: React.FC = () => {
  const employees = [
    { code: 'E001', name: 'John Doe', dept: 'Engineering', avgStress: '15%', status: 'Active' },
    { code: 'E002', name: 'Jane Smith', dept: 'HR', avgStress: '42%', status: 'Active' },
    { code: 'E003', name: 'Mike Johnson', dept: 'Sales', avgStress: '68%', status: 'On Leave' },
    { code: 'E004', name: 'Sarah Wilson', dept: 'Engineering', avgStress: '22%', status: 'Active' },
    { code: 'E005', name: 'Robert Lee', dept: 'Marketing', avgStress: '35%', status: 'Active' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Admin Control Center</h1>
        <div className="space-x-3">
          <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50">Export PDF Report</button>
          <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700">Add User</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <p className="text-xs font-bold text-gray-500 uppercase">Total Employees</p>
          <p className="text-2xl font-black mt-1">1,248</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <p className="text-xs font-bold text-gray-500 uppercase">Monitored Today</p>
          <p className="text-2xl font-black mt-1 text-indigo-600">452</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <p className="text-xs font-bold text-gray-500 uppercase">System Alerts</p>
          <p className="text-2xl font-black mt-1 text-red-500">3</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <p className="text-xs font-bold text-gray-500 uppercase">Org Happiness Index</p>
          <p className="text-2xl font-black mt-1 text-green-500">7.8/10</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="font-bold text-gray-800 mb-6">Organization-Wide Insights</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-100 text-xs text-gray-500 uppercase font-bold">
                <th className="pb-3 px-2">Emp Code</th>
                <th className="pb-3 px-2">Name</th>
                <th className="pb-3 px-2">Department</th>
                <th className="pb-3 px-2">Avg. Stress</th>
                <th className="pb-3 px-2">Status</th>
                <th className="pb-3 px-2 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {employees.map((emp) => (
                <tr key={emp.code} className="border-b border-gray-50 hover:bg-gray-50 transition">
                  <td className="py-4 px-2 font-mono text-xs">{emp.code}</td>
                  <td className="py-4 px-2 font-medium">{emp.name}</td>
                  <td className="py-4 px-2 text-gray-600">{emp.dept}</td>
                  <td className="py-4 px-2 font-bold text-indigo-600">{emp.avgStress}</td>
                  <td className="py-4 px-2">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      emp.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {emp.status}
                    </span>
                  </td>
                  <td className="py-4 px-2 text-right">
                    <button className="text-indigo-600 font-bold hover:underline">View File</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="bg-indigo-50 p-6 rounded-xl border border-indigo-100 flex items-center space-x-6">
        <div className="text-3xl">💡</div>
        <div>
          <h4 className="font-bold text-indigo-900">Admin Note</h4>
          <p className="text-sm text-indigo-800">
            The Sales department has shown a 15% increase in high-stress logs this week. Consider scheduling the "Work-Life Integration" webinar for their team leads.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
