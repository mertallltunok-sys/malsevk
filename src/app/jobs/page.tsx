"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getJobs, getUserById, CATEGORIES, CITIES, type Job } from "@/lib/storage";

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [city, setCity] = useState("all");

  useEffect(() => {
    // Client-side'da işleri yükle
    try {
      const allJobs = getJobs();
      setJobs(allJobs);
      setFilteredJobs(allJobs);
    } catch (error) {
      console.error("Jobs load error:", error);
      setJobs([]);
      setFilteredJobs([]);
    }
  }, []);

  useEffect(() => {
    let filtered = jobs;

    if (search) {
      filtered = filtered.filter(
        (j) =>
          j.title.toLowerCase().includes(search.toLowerCase()) ||
          j.company.toLowerCase().includes(search.toLowerCase()) ||
          j.description.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (category !== "all") {
      filtered = filtered.filter((j) => j.category === category);
    }

    if (city !== "all") {
      filtered = filtered.filter((j) => j.city === city);
    }

    setFilteredJobs(filtered);
  }, [search, category, city, jobs]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Header & Filters */}
      <div className="bg-white rounded-2xl shadow-md p-6 mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-[#1e3a8a]">
              <i className="fas fa-list-alt mr-2" />
              İş İlanları
            </h1>
            <p className="text-gray-500 mt-1">
              Toplam <strong>{filteredJobs.length}</strong> ilan bulundu
            </p>
          </div>
          <Link
            href="/jobs/new"
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-xl font-semibold transition-all hover:-translate-y-0.5 shadow-md whitespace-nowrap"
          >
            <i className="fas fa-plus mr-2" />
            Yeni İlan Ver
          </Link>
        </div>

        {/* Search */}
        <div className="mb-4">
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
              <i className="fas fa-search" />
            </span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="İlan ara... (başlık, firma, açıklama)"
              className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#1e3a8a] transition-colors"
            />
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#1e3a8a] transition-colors bg-white"
          >
            <option value="all">Tüm Kategoriler</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <select
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#1e3a8a] transition-colors bg-white"
          >
            <option value="all">Tüm Şehirler</option>
            {CITIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Job List */}
      {filteredJobs.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl shadow-md">
          <i className="fas fa-inbox text-5xl text-gray-300" />
          <p className="text-gray-500 mt-4 text-lg">
            {jobs.length === 0
              ? "Henüz ilan bulunamadı."
              : "Arama kriterlerinize uygun ilan bulunamadı."}
          </p>
          <Link
            href="/jobs/new"
            className="inline-block mt-4 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-xl font-semibold transition-all"
          >
            İlk İlanı Sen Ver
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredJobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      )}
    </div>
  );
}

function JobCard({ job }: { job: Job }) {
  const user = getUserById(job.userId);
  return (
    <Link href={`/jobs/${job.id}`} className="block">
      <div className="bg-white rounded-2xl shadow-md p-6 border-l-4 border-orange-500 hover:shadow-xl hover:translate-x-1 transition-all cursor-pointer">
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-[#1e3a8a]">{job.title}</h3>
            <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <i className="fas fa-building text-orange-500" />
                {job.company}
              </span>
              <span className="flex items-center gap-1">
                <i className="fas fa-map-marker-alt text-orange-500" />
                {job.city} / {job.district}
              </span>
              <span className="flex items-center gap-1">
                <i className="fas fa-tag text-orange-500" />
                {job.category}
              </span>
              <span className="flex items-center gap-1">
                <i className="fas fa-calendar text-orange-500" />
                {job.date} {job.time}
              </span>
            </div>
            {job.description && (
              <p className="text-gray-600 mt-3 line-clamp-2">
                {job.description}
              </p>
            )}
            <div className="mt-3 text-sm text-gray-400">
              <i className="fas fa-user mr-1" />
              {user?.name || "Kullanıcı"}
            </div>
          </div>
          <div className="flex flex-col items-end gap-2 shrink-0">
            <span className="bg-orange-500 text-white px-4 py-2 rounded-full font-bold text-lg">
              ₺{parseInt(job.budget).toLocaleString("tr-TR")}
            </span>
            <span
              className={`text-xs px-3 py-1 rounded-full font-semibold ${
                job.status === "open"
                  ? "bg-green-100 text-green-700"
                  : job.status === "service_selected"
                  ? "bg-blue-100 text-blue-700"
                  : job.status === "completed"
                  ? "bg-purple-100 text-purple-700"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              {job.status === "open"
                ? "Açık"
                : job.status === "service_selected"
                ? "Hizmet Veren Seçildi"
                : job.status === "completed"
                ? "Tamamlandı"
                : "İptal"}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
