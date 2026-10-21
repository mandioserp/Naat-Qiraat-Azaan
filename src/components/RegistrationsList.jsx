import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import {
  Search,
  BookOpen,
  HeartHandshake,
  Volume2,
  Download,
  Users,
  Eye,
  RefreshCw,
} from 'lucide-react';
import {
  CLASSES,
  HOUSES,
  ALL_HOUSES,
} from '../constants';

export function RegistrationsList({
  registrations,
  isLoading,
  onSelectRegistration,
  onRefresh,
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [houseFilter, setHouseFilter] = useState('ALL');
  const [eventFilter, setEventFilter] = useState('ALL');
  const [classFilter, setClassFilter] = useState('ALL');

  // Compute 6 House Stats
  const houseStats = useMemo(() => {
    const counts = {
      Jinnah: 0,
      Fatima: 0,
      'Sir Syed': 0,
      Ayesha: 0,
      Iqbal: 0,
      Khadijah: 0,
    };
    registrations.forEach((r) => {
      if (r.house in counts) {
        counts[r.house]++;
      }
    });
    return counts;
  }, [registrations]);

  // Compute Event Stats
  const eventStats = useMemo(() => {
    const counts = {
      Naat: 0,
      Qiraat: 0,
      Azan: 0,
    };
    registrations.forEach((r) => {
      if (r.event in counts) {
        counts[r.event]++;
      }
    });
    return counts;
  }, [registrations]);

  // Filtered List
  const filteredRegistrations = useMemo(() => {
    return registrations.filter((item) => {
      const matchSearch =
        searchTerm === '' ||
        item.admNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.name.toLowerCase().includes(searchTerm.toLowerCase());

      const matchHouse = houseFilter === 'ALL' || item.house === houseFilter;
      const matchEvent = eventFilter === 'ALL' || item.event === eventFilter;
      const matchClass = classFilter === 'ALL' || item.studentClass === classFilter;

      return matchSearch && matchHouse && matchEvent && matchClass;
    });
  }, [registrations, searchTerm, houseFilter, eventFilter, classFilter]);

  // Export to CSV
  const handleExportCSV = () => {
    if (filteredRegistrations.length === 0) return;
    const headers = ['Adm No', 'Student Name', 'Gender', 'Class', 'Event', 'House', 'Registration Date'];
    const rows = filteredRegistrations.map((r) => [
      `"${r.admNo}"`,
      `"${r.name}"`,
      `"${r.gender || ''}"`,
      `"${r.studentClass}"`,
      `"${r.event}"`,
      `"${r.house}"`,
      `"${new Date(r.createdAt).toLocaleString()}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Inter_House_Registrations_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Sleek 6 Houses Statistics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {ALL_HOUSES.map((houseKey, idx) => {
          const info = HOUSES[houseKey];
          const isSelected = houseFilter === houseKey;
          return (
            <motion.div
              key={houseKey}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: idx * 0.05 }}
              onClick={() => setHouseFilter(isSelected ? 'ALL' : houseKey)}
              className={`cursor-pointer rounded-2xl p-4 border transition-all shadow-sm flex flex-col justify-between ${
                isSelected
                  ? 'bg-[#7B1113] text-white border-[#7B1113] ring-2 ring-white/20'
                  : 'bg-white hover:border-gray-300 text-gray-900 border-gray-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-[#7B1113] text-white'
                  }`}
                >
                  {houseKey[0]}
                </div>
                <span className="text-2xl font-black">{houseStats[houseKey]}</span>
              </div>
              <div className="mt-3">
                <h4 className="font-bold text-xs sm:text-sm truncate">{houseKey} House</h4>
                <span className={`text-[10px] ${isSelected ? 'text-white/80' : 'text-gray-500'} font-amiri font-bold block`}>
                  {info.urduName}
                </span>
              </div>
              <div className={`mt-2 pt-1.5 border-t text-[10px] flex items-center justify-between ${
                isSelected ? 'border-white/20 text-white/80' : 'border-gray-100 text-gray-400'
              }`}>
                <span>{isSelected ? 'Active Filter' : 'Filter'}</span>
                <span>•</span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Main Roster Card */}
      <div className="bg-white rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-gray-100 overflow-hidden">
        {/* Top Control Bar */}
        <div className="p-6 sm:p-8 bg-white border-b border-gray-100 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-2xl font-bold text-[#7B1113] flex items-center gap-2">
                <Users className="w-6 h-6 text-[#7B1113]" />
                <span>Participants Directory</span>
              </h3>
              <div className="h-1 w-10 bg-[#7B1113] mt-1.5 mb-1"></div>
              <p className="text-xs text-gray-500">
                Showing {filteredRegistrations.length} of {registrations.length} total registrations across 6 houses
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={onRefresh}
                className="p-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                title="Refresh"
              >
                <RefreshCw className="w-4 h-4" />
                <span className="hidden sm:inline">Refresh</span>
              </button>
              <button
                onClick={handleExportCSV}
                disabled={filteredRegistrations.length === 0}
                className="px-4 py-2.5 rounded-xl bg-[#7B1113] hover:bg-[#630d0f] text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-md disabled:opacity-50"
              >
                <Download className="w-4 h-4" />
                <span>Export Excel</span>
              </button>
            </div>
          </div>

          {/* Search and Filters Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
            <div className="relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search Adm No or Name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-xs sm:text-sm focus:bg-white focus:border-[#7B1113] outline-none transition-colors"
              />
            </div>

            <div>
              <select
                value={houseFilter}
                onChange={(e) => setHouseFilter(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-xs sm:text-sm focus:bg-white focus:border-[#7B1113] outline-none cursor-pointer"
              >
                <option value="ALL">All Houses ({registrations.length})</option>
                {ALL_HOUSES.map((h) => (
                  <option key={h} value={h}>
                    {h} House ({houseStats[h]})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <select
                value={eventFilter}
                onChange={(e) => setEventFilter(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-xs sm:text-sm focus:bg-white focus:border-[#7B1113] outline-none cursor-pointer"
              >
                <option value="ALL">All Events ({registrations.length})</option>
                <option value="Naat">Naat ({eventStats.Naat})</option>
                <option value="Qiraat">Qiraat ({eventStats.Qiraat})</option>
                <option value="Azan">Azan ({eventStats.Azan})</option>
              </select>
            </div>

            <div>
              <select
                value={classFilter}
                onChange={(e) => setClassFilter(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-xs sm:text-sm focus:bg-white focus:border-[#7B1113] outline-none cursor-pointer"
              >
                <option value="ALL">All Classes (1 to 10)</option>
                {CLASSES.map((cls) => (
                  <option key={cls} value={cls}>
                    {cls}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Table Content */}
        {isLoading ? (
          <div className="py-20 text-center text-gray-500 space-y-3">
            <div className="w-8 h-8 border-3 border-[#7B1113] border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs font-medium">Loading entries...</p>
          </div>
        ) : filteredRegistrations.length === 0 ? (
          <div className="py-16 text-center text-gray-400 space-y-2">
            <BookOpen className="w-10 h-10 mx-auto text-gray-300" />
            <p className="text-sm font-semibold text-gray-700">No Registrations Found</p>
            <p className="text-xs">No participant records matching your current filter.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-gray-50 text-gray-500 uppercase font-bold text-[11px] tracking-wider border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4">Adm No</th>
                  <th className="px-6 py-4">Student Name</th>
                  <th className="px-6 py-4">Class</th>
                  <th className="px-6 py-4">Event</th>
                  <th className="px-6 py-4">House</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredRegistrations.map((item, idx) => (
                  <tr
                    key={item.id || `${item.admNo}-${idx}`}
                    className="hover:bg-gray-50/80 transition-colors"
                  >
                    <td className="px-6 py-4 font-mono font-bold text-[#7B1113]">
                      {item.admNo}
                    </td>
                    <td className="px-6 py-4 font-semibold text-gray-900">
                      {item.name}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      <span className="px-2.5 py-1 rounded-md bg-gray-100 text-xs font-medium">
                        {item.studentClass}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-800">
                        {item.event === 'Naat' && <HeartHandshake className="w-3.5 h-3.5 text-[#7B1113]" />}
                        {item.event === 'Qiraat' && <BookOpen className="w-3.5 h-3.5 text-[#7B1113]" />}
                        {item.event === 'Azan' && <Volume2 className="w-3.5 h-3.5 text-[#7B1113]" />}
                        <span>{item.event}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-700">
                      {item.house} House
                    </td>
                    <td className="px-6 py-4 text-gray-400 text-xs">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => onSelectRegistration(item)}
                        className="px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-[#7B1113] hover:text-white text-gray-700 text-xs font-semibold inline-flex items-center gap-1.5 transition-all"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Details</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
