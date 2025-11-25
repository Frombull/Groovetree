"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/app/hooks/useAuth";
import { useRouter } from "next/navigation";
import Link from "next/link";
import UserMenu from "@/app/components/UserMenu";
import {
  FaEye,
  FaHeart,
  FaCalendarAlt,
  FaChartLine,
  FaCog,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import { RiShareFill } from "react-icons/ri";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import toast from "react-hot-toast";

interface AnalyticsData {
  totals: {
    pageViews: number;
    favorites: number;
    shares: number;
  };
  charts: {
    pageViews: Array<{ date: string; count: number }>;
    favorites: Array<{ date: string; count: number }>;
    shares: Array<{ date: string; count: number }>;
  };
}

type Period = "7d" | "30d" | "90d" | "all";

export default function AnalyticsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [period, setPeriod] = useState<Period>("30d");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      fetchAnalytics();
    }
  }, [user, period]);

  const fetchAnalytics = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/analytics/stats?period=${period}`);
      if (!response.ok) {
        throw new Error("Failed to fetch analytics");
      }
      const data = await response.json();
      setAnalyticsData(data);
    } catch (error) {
      console.error("Error fetching analytics:", error);
      toast.error("Error loading analytics");
    } finally {
      setIsLoading(false);
    }
  };

  const getPeriodLabel = (p: Period) => {
    switch (p) {
      case "7d":
        return "Last 7 days";
      case "30d":
        return "Last 30 days";
      case "90d":
        return "Last 90 days";
      case "all":
        return "All time";
    }
  };

  // Combinar dados dos gráficos em um único dataset e tornar cumulativo
  const combineChartData = () => {
    if (!analyticsData) return [];

    const dateMap = new Map<string, any>();

    analyticsData.charts.pageViews.forEach((item) => {
      if (!dateMap.has(item.date)) {
        dateMap.set(item.date, {
          date: item.date,
          pageViews: 0,
          favorites: 0,
          shares: 0,
          dailyPageViews: 0,
          dailyFavorites: 0,
          dailyShares: 0,
        });
      }
      dateMap.get(item.date)!.pageViews = item.count;
      dateMap.get(item.date)!.dailyPageViews = item.count;
    });

    analyticsData.charts.favorites.forEach((item) => {
      if (!dateMap.has(item.date)) {
        dateMap.set(item.date, {
          date: item.date,
          pageViews: 0,
          favorites: 0,
          shares: 0,
          dailyPageViews: 0,
          dailyFavorites: 0,
          dailyShares: 0,
        });
      }
      dateMap.get(item.date)!.favorites = item.count;
      dateMap.get(item.date)!.dailyFavorites = item.count;
    });

    analyticsData.charts.shares.forEach((item) => {
      if (!dateMap.has(item.date)) {
        dateMap.set(item.date, {
          date: item.date,
          pageViews: 0,
          favorites: 0,
          shares: 0,
          dailyPageViews: 0,
          dailyFavorites: 0,
          dailyShares: 0,
        });
      }
      dateMap.get(item.date)!.shares = item.count;
      dateMap.get(item.date)!.dailyShares = item.count;
    });

    // Ordenar por data e tornar cumulativo
    const sortedData = Array.from(dateMap.values()).sort((a, b) =>
      a.date.localeCompare(b.date)
    );

    let cumulativePageViews = 0;
    let cumulativeFavorites = 0;
    let cumulativeShares = 0;

    return sortedData.map((item) => {
      cumulativePageViews += item.pageViews;
      cumulativeFavorites += item.favorites;
      cumulativeShares += item.shares;

      return {
        date: item.date,
        pageViews: cumulativePageViews,
        favorites: cumulativeFavorites,
        shares: cumulativeShares,
        dailyPageViews: item.dailyPageViews,
        dailyFavorites: item.dailyFavorites,
        dailyShares: item.dailyShares,
      };
    });
  };

  const formatDate = (dateStr: string) => {
    // Parse the date string and add timezone offset to get local date
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString("pt-BR", { month: "short", day: "numeric" });
  };

  if (loading || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950">
      {/* Header */}
      <header className="bg-white dark:bg-slate-950 border-b border-gray-200 dark:border-gray-700 px-6 py-3 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/">
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 cursor-pointer hover:opacity-80 transition-opacity whitespace-nowrap font-[family-name:var(--font-logo)] flex items-center translate-y-0.5">
                Groovetree
              </h1>
            </Link>
          </div>

          <div className="flex items-center gap-2 md:gap-3">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg bg-white dark:bg-slate-900 border border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-700 transition-all text-gray-700 dark:text-gray-300"
              aria-label="Menu"
            >
              {mobileMenuOpen ? (
                <FaTimes className="w-5 h-5" />
              ) : (
                <FaBars className="w-5 h-5" />
              )}
            </button>

            {/* Desktop Navigation Buttons */}
            <Link
              href="/dashboard/edit"
              className="hidden md:flex p-2 md:px-4 md:py-2 rounded-lg bg-white dark:bg-slate-900 border border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-700 transition-all cursor-pointer items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400"
              title="Edit Page"
            >
              <MdEdit className="w-4 h-4" />
              <span className="text-sm font-medium">Edit Page</span>
            </Link>

            <Link
              href="/dashboard/favorites"
              className="hidden md:flex p-2 md:px-4 md:py-2 rounded-lg bg-white dark:bg-slate-900 border border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-700 transition-all cursor-pointer items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400"
              title="Favorite Artists"
            >
              <FaHeart className="w-4 h-4" />
              <span className="text-sm font-medium">Favorites</span>
            </Link>

            <Link
              href="/dashboard/calendar"
              className="hidden md:flex p-2 md:px-4 md:py-2 rounded-lg bg-white dark:bg-slate-900 border border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-700 transition-all cursor-pointer items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400"
              title="Artist Shows"
            >
              <FaCalendarAlt className="w-4 h-4" />
              <span className="text-sm font-medium">Calendar</span>
            </Link>

            <Link
              href="/dashboard/analytics"
              className="hidden md:flex p-2 md:px-4 md:py-2 rounded-lg bg-purple-100 dark:bg-purple-900/30 border border-purple-300 dark:border-purple-700 transition-all cursor-pointer items-center gap-2 text-purple-700 dark:text-purple-300 font-semibold"
              title="Analytics"
            >
              <FaChartLine className="w-4 h-4" />
              <span className="text-sm font-medium">Analytics</span>
            </Link>

            <Link
              href="/settings"
              className="hidden md:flex p-2 md:px-4 md:py-2 rounded-lg bg-white dark:bg-slate-900 border border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-700 transition-all cursor-pointer items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400"
              title="Settings"
            >
              <FaCog className="w-4 h-4" />
              <span className="text-sm font-medium">Settings</span>
            </Link>

            {user && (
              <div className="scale-90">
                <UserMenu user={user} />
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-white dark:bg-slate-950 border-b border-gray-200 dark:border-gray-700 shadow-lg">
            <nav className="max-w-7xl mx-auto px-6 py-4 flex flex-col gap-2">
              <Link
                href="/dashboard/edit"
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-900 text-gray-700 dark:text-gray-300"
                onClick={() => setMobileMenuOpen(false)}
              >
                <MdEdit className="w-5 h-5" />
                <span>Edit Page</span>
              </Link>
              <Link
                href="/dashboard/favorites"
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-900 text-gray-700 dark:text-gray-300"
                onClick={() => setMobileMenuOpen(false)}
              >
                <FaHeart className="w-5 h-5" />
                <span>Favorites</span>
              </Link>
              <Link
                href="/dashboard/calendar"
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-900 text-gray-700 dark:text-gray-300"
                onClick={() => setMobileMenuOpen(false)}
              >
                <FaCalendarAlt className="w-5 h-5" />
                <span>Calendar</span>
              </Link>
              <Link
                href="/dashboard/analytics"
                className="flex items-center gap-3 p-3 rounded-lg bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                <FaChartLine className="w-5 h-5" />
                <span>Analytics</span>
              </Link>
              <Link
                href="/settings"
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-900 text-gray-700 dark:text-gray-300"
                onClick={() => setMobileMenuOpen(false)}
              >
                <FaCog className="w-5 h-5" />
                <span>Settings</span>
              </Link>
            </nav>
          </div>
        )}
      </header>

      <div className="max-w-7xl mx-auto p-4 sm:p-6">
        {/* Page Title */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-3">
            <FaChartLine className="text-purple-600" />
            Analytics
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Track your Groovetree performance over time
          </p>
        </div>

        {/* Period Filter */}
        <div className="mb-6 flex gap-2 flex-wrap">
          {(["7d", "30d", "90d", "all"] as Period[]).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-4 py-2 rounded-lg font-medium transition-all cursor-pointer ${
                period === p
                  ? "bg-purple-600 text-white shadow-lg"
                  : "bg-white dark:bg-slate-900 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-700"
              }`}
            >
              <FaCalendarAlt className="inline mr-2" />
              {getPeriodLabel(p)}
            </button>
          ))}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Page Views Card */}
          <div className="bg-white dark:bg-slate-950 rounded-2xl shadow-sm border dark:border-gray-800 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <FaEye className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
            <h3 className="text-gray-600 dark:text-gray-400 text-sm font-medium mb-1">
              Page Views
            </h3>
            <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              {analyticsData?.totals.pageViews.toLocaleString() || 0}
            </p>
          </div>

          {/* Favorites Card */}
          <div className="bg-white dark:bg-slate-950 rounded-2xl shadow-sm border dark:border-gray-800 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-pink-100 dark:bg-pink-900/30 rounded-lg">
                <FaHeart className="w-6 h-6 text-pink-600 dark:text-pink-400" />
              </div>
            </div>
            <h3 className="text-gray-600 dark:text-gray-400 text-sm font-medium mb-1">
              Favorites
            </h3>
            <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              {analyticsData?.totals.favorites.toLocaleString() || 0}
            </p>
          </div>

          {/* Shares Card */}
          <div className="bg-white dark:bg-slate-950 rounded-2xl shadow-sm border dark:border-gray-800 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <RiShareFill className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <h3 className="text-gray-600 dark:text-gray-400 text-sm font-medium mb-1">
              Shares
            </h3>
            <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              {analyticsData?.totals.shares.toLocaleString() || 0}
            </p>
          </div>
        </div>

        {/* Combined Chart */}
        <div className="bg-white dark:bg-slate-950 rounded-2xl shadow-sm border dark:border-gray-800 p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6">
            Metrics over time
          </h2>
          <div className="w-full h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={combineChartData()}>
                <defs>
                  <linearGradient
                    id="colorPageViews"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#9333EA" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#9333EA" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient
                    id="colorFavorites"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#EC4899" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#EC4899" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorShares" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#374151"
                  opacity={0.1}
                />
                <XAxis
                  dataKey="date"
                  tickFormatter={formatDate}
                  stroke="#9CA3AF"
                  style={{ fontSize: "12px" }}
                />
                <YAxis stroke="#9CA3AF" style={{ fontSize: "12px" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1F2937",
                    border: "1px solid #374151",
                    borderRadius: "8px",
                    color: "#F9FAFB",
                  }}
                  labelFormatter={(label) => formatDate(label as string)}
                  formatter={(value: number, name: string) => {
                    // Show only daily values in tooltip
                    if (name === "Page Views")
                      return [value, "Views on this day"];
                    if (name === "Favorites")
                      return [value, "Favorites on this day"];
                    if (name === "Shares") return [value, "Shares on this day"];
                    return [value, name];
                  }}
                />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="dailyPageViews"
                  stroke="#9333EA"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorPageViews)"
                  name="Page Views"
                />
                <Area
                  type="monotone"
                  dataKey="dailyFavorites"
                  stroke="#EC4899"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorFavorites)"
                  name="Favorites"
                />
                <Area
                  type="monotone"
                  dataKey="dailyShares"
                  stroke="#3B82F6"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorShares)"
                  name="Shares"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
