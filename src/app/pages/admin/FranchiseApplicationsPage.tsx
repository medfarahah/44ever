import { motion } from "motion/react";
import { useState, useEffect } from "react";
import { Search, Filter, Eye, Mail, Phone, MapPin, CheckCircle, XCircle, Clock, User, Building2, DollarSign, X } from "lucide-react";
import { franchiseAPI } from "../../services/api";

export function FranchiseApplicationsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedApplication, setSelectedApplication] = useState<any | null>(null);
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const data = await franchiseAPI.getAll();
        setApplications(data);
      } catch (error) {
        console.error("Failed to fetch applications:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, []);

  const filteredApplications = applications.filter(app => {
    const matchesSearch = 
      app.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === "all" || app.status.toLowerCase() === filterStatus.toLowerCase();
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Approved": return "bg-green-100 text-green-700";
      case "Rejected": return "bg-red-100 text-red-700";
      case "Reviewing": return "bg-blue-100 text-blue-700";
      case "Pending": return "bg-yellow-100 text-yellow-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Approved": return <CheckCircle size={16} />;
      case "Rejected": return <XCircle size={16} />;
      case "Reviewing": return <Clock size={16} />;
      default: return <Clock size={16} />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#2D2A26] mb-2">Franchise Applications</h1>
          <p className="text-sm text-[#5C5852]">Manage franchise partner applications and inquiries</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-[#A88B5C] text-white rounded-lg hover:bg-[#8F7A52] transition-colors text-sm">
            Export
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        {[
          { label: "Total Applications", value: applications.length, icon: User, color: "bg-blue-500" },
          { label: "Pending", value: applications.filter(a => a.status === "Pending").length, icon: Clock, color: "bg-yellow-500" },
          { label: "Approved", value: applications.filter(a => a.status === "Approved").length, icon: CheckCircle, color: "bg-green-500" },
          { label: "Reviewing", value: applications.filter(a => a.status === "Reviewing").length, icon: Building2, color: "bg-purple-500" },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-white p-4 rounded-lg border border-[#A88B5C]/10 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-[#5C5852] mb-1">{stat.label}</div>
                  <div className="text-2xl font-bold text-[#2D2A26]">{stat.value}</div>
                </div>
                <div className={`w-10 h-10 ${stat.color} rounded-lg flex items-center justify-center`}>
                  <Icon className="text-white" size={20} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg border border-[#A88B5C]/10 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#5C5852]" size={20} />
            <input
              type="text"
              placeholder="Search applications..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-[#A88B5C]/20 rounded-lg focus:outline-none focus:border-[#A88B5C]"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-[#5C5852]" size={20} />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="pl-10 pr-8 py-2 border border-[#A88B5C]/20 rounded-lg focus:outline-none focus:border-[#A88B5C] appearance-none bg-white"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="reviewing">Reviewing</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>
      </div>

      {/* Applications Table */}
      {loading ? (
        <div className="text-center py-12 text-[#5C5852]">Loading applications...</div>
      ) : (
        <div className="bg-white rounded-lg border border-[#A88B5C]/10 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#F5F5F5]">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#5C5852] uppercase tracking-wider">Applicant</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#5C5852] uppercase tracking-wider">Location</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#5C5852] uppercase tracking-wider">Investment</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#5C5852] uppercase tracking-wider">Experience</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#5C5852] uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#5C5852] uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#5C5852] uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredApplications.map((application) => (
                  <motion.tr
                    key={application.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-[#FFF8E7] transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-[#2D2A26]">
                        {application.firstName} {application.lastName}
                      </div>
                      <div className="text-sm text-[#5C5852]">{application.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-[#2D2A26]">{application.location}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-[#A88B5C] font-medium">{application.investmentRange}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-[#5C5852]">{application.experience}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded flex items-center gap-1 w-fit ${getStatusColor(application.status)}`}>
                        {getStatusIcon(application.status)}
                        {application.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#5C5852]">
                      {application.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => setSelectedApplication(application)}
                        className="text-[#A88B5C] hover:text-[#8F7A52] transition-colors"
                      >
                        <Eye size={18} />
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Application Detail Modal */}
      {selectedApplication && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg p-6 max-w-2xl w-full my-8 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-[#2D2A26]">
                Application Details
              </h2>
              <button
                onClick={() => setSelectedApplication(null)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-6">
              {/* Personal Information */}
              <div>
                <h3 className="text-lg font-semibold text-[#2D2A26] mb-4 flex items-center gap-2">
                  <User size={20} />
                  Personal Information
                </h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-[#5C5852] mb-1">Full Name</label>
                    <p className="text-sm text-[#2D2A26]">
                      {selectedApplication.firstName} {selectedApplication.lastName}
                    </p>
                  </div>
                  <div>
                    <label className="block text-xs text-[#5C5852] mb-1">Company</label>
                    <p className="text-sm text-[#2D2A26]">
                      {selectedApplication.company || "N/A"}
                    </p>
                  </div>
                  <div>
                    <label className="block text-xs text-[#5C5852] mb-1 flex items-center gap-1">
                      <Mail size={14} />
                      Email
                    </label>
                    <p className="text-sm text-[#2D2A26]">{selectedApplication.email}</p>
                  </div>
                  <div>
                    <label className="block text-xs text-[#5C5852] mb-1 flex items-center gap-1">
                      <Phone size={14} />
                      Phone
                    </label>
                    <p className="text-sm text-[#2D2A26]">{selectedApplication.phone}</p>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs text-[#5C5852] mb-1 flex items-center gap-1">
                      <MapPin size={14} />
                      Preferred Location
                    </label>
                    <p className="text-sm text-[#2D2A26]">{selectedApplication.location}</p>
                  </div>
                </div>
              </div>

              {/* Business Information */}
              <div>
                <h3 className="text-lg font-semibold text-[#2D2A26] mb-4 flex items-center gap-2">
                  <Building2 size={20} />
                  Business Information
                </h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-[#5C5852] mb-1 flex items-center gap-1">
                      <DollarSign size={14} />
                      Investment Range
                    </label>
                    <p className="text-sm text-[#A88B5C] font-medium">{selectedApplication.investmentRange}</p>
                  </div>
                  <div>
                    <label className="block text-xs text-[#5C5852] mb-1">Experience Level</label>
                    <p className="text-sm text-[#2D2A26]">{selectedApplication.experience}</p>
                  </div>
                </div>
              </div>

              {/* Message */}
              <div>
                <h3 className="text-lg font-semibold text-[#2D2A26] mb-4">Message</h3>
                <div className="bg-[#F5F5F5] p-4 rounded-lg">
                  <p className="text-sm text-[#5C5852] leading-relaxed">
                    {selectedApplication.message}
                  </p>
                </div>
              </div>

              {/* Status & Notes */}
              <div>
                <h3 className="text-lg font-semibold text-[#2D2A26] mb-4">Status & Notes</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs text-[#5C5852] mb-2">Current Status</label>
                    <span className={`px-3 py-2 text-sm rounded flex items-center gap-2 w-fit ${getStatusColor(selectedApplication.status)}`}>
                      {getStatusIcon(selectedApplication.status)}
                      {selectedApplication.status}
                    </span>
                  </div>
                  <div>
                    <label className="block text-xs text-[#5C5852] mb-2">Admin Notes</label>
                    <textarea
                      rows={3}
                      defaultValue={selectedApplication.notes || ""}
                      placeholder="Add notes about this application..."
                      onChange={async (e) => {
                        try {
                          await franchiseAPI.update(selectedApplication.id, { notes: e.target.value });
                          const data = await franchiseAPI.getAll();
                          setApplications(data);
                          const updated = data.find((app: any) => app.id === selectedApplication.id);
                          if (updated) setSelectedApplication(updated);
                        } catch (error) {
                          console.error("Failed to update notes:", error);
                        }
                      }}
                      className="w-full px-4 py-2 border border-[#A88B5C]/20 rounded-lg focus:outline-none focus:border-[#A88B5C] resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t border-[#A88B5C]/20">
                <button
                  onClick={async () => {
                    try {
                      await franchiseAPI.update(selectedApplication.id, { status: "Approved" });
                      const data = await franchiseAPI.getAll();
                      setApplications(data);
                      alert("Application approved!");
                      setSelectedApplication(null);
                    } catch (error) {
                      console.error("Failed to update application:", error);
                      alert("Failed to update application. Please try again.");
                    }
                  }}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Approve
                </button>
                <button
                  onClick={async () => {
                    try {
                      await franchiseAPI.update(selectedApplication.id, { status: "Rejected" });
                      const data = await franchiseAPI.getAll();
                      setApplications(data);
                      alert("Application rejected.");
                      setSelectedApplication(null);
                    } catch (error) {
                      console.error("Failed to update application:", error);
                      alert("Failed to update application. Please try again.");
                    }
                  }}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Reject
                </button>
                <button
                  onClick={async () => {
                    try {
                      await franchiseAPI.update(selectedApplication.id, { status: "Reviewing" });
                      const data = await franchiseAPI.getAll();
                      setApplications(data);
                      alert("Status updated to Reviewing");
                      setSelectedApplication(null);
                    } catch (error) {
                      console.error("Failed to update application:", error);
                      alert("Failed to update application. Please try again.");
                    }
                  }}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Mark as Reviewing
                </button>
                <button
                  onClick={() => setSelectedApplication(null)}
                  className="px-4 py-2 border border-[#A88B5C] text-[#A88B5C] rounded-lg hover:bg-[#A88B5C] hover:text-white transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

