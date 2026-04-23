import { useEffect, useState } from "react";
import { getAllMeetings } from "../services/meetingsService";
import LoadingSpinner from "../components/LoadingSpinner";
import EmptyState from "../components/EmptyState";

const STATUS_COLORS = {
    DRAFT: "bg-yellow-100 text-yellow-800",
    PUBLISHED: "bg-green-100 text-green-800",
    ARCHIVED: "bg-gray-100 text-gray-600",
};

export default function MeetingListPage() {
    const [meetings, setMeetings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        fetchMeetings();
    }, [page]);

    const fetchMeetings = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await getAllMeetings(page, 10);
            // Handles both paginated {content:[]} and plain array responses
            if (res.data.content) {
                setMeetings(res.data.content);
                setTotalPages(res.data.totalPages);
            } else {
                setMeetings(res.data);
            }
        } catch (err) {
            setError("Failed to load meetings. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-6xl mx-auto">

                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">Board Meeting Minutes</h1>
                    <button
                        className="bg-blue-700 text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition"
                        onClick={() => window.location.href = "/meetings/new"}
                    >
                        + New Meeting
                    </button>
                </div>

                {/* Error */}
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
                        {error}
                    </div>
                )}

                {/* Loading */}
                {loading && <LoadingSpinner />}

                {/* Empty State */}
                {!loading && !error && meetings.length === 0 && (
                    <EmptyState message="No meeting minutes yet. Create your first one!" />
                )}

                {/* Table */}
                {!loading && meetings.length > 0 && (
                    <div className="bg-white rounded-xl shadow overflow-hidden">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
                                <tr>
                                    <th className="px-6 py-3">Title</th>
                                    <th className="px-6 py-3">Meeting Date</th>
                                    <th className="px-6 py-3">Location</th>
                                    <th className="px-6 py-3">Status</th>
                                    <th className="px-6 py-3">Created By</th>
                                    <th className="px-6 py-3">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {meetings.map((m) => (
                                    <tr key={m.id} className="hover:bg-gray-50 transition">
                                        <td className="px-6 py-4 font-medium text-gray-800">{m.title}</td>
                                        <td className="px-6 py-4 text-gray-600">{m.meetingDate}</td>
                                        <td className="px-6 py-4 text-gray-600">{m.location || "—"}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${STATUS_COLORS[m.status] || "bg-gray-100 text-gray-600"}`}>
                                                {m.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-gray-600">{m.createdBy || "—"}</td>
                                        <td className="px-6 py-4">
                                            <button
                                                className="text-blue-600 hover:underline mr-3"
                                                onClick={() => window.location.href = `/meetings/${m.id}`}
                                            >
                                                View
                                            </button>
                                            <button
                                                className="text-yellow-600 hover:underline"
                                                onClick={() => window.location.href = `/meetings/${m.id}/edit`}
                                            >
                                                Edit
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex justify-center items-center gap-4 py-4 border-t">
                                <button
                                    className="px-3 py-1 rounded border text-sm disabled:opacity-40"
                                    disabled={page === 0}
                                    onClick={() => setPage((p) => p - 1)}
                                >
                                    ← Prev
                                </button>
                                <span className="text-sm text-gray-600">Page {page + 1} of {totalPages}</span>
                                <button
                                    className="px-3 py-1 rounded border text-sm disabled:opacity-40"
                                    disabled={page >= totalPages - 1}
                                    onClick={() => setPage((p) => p + 1)}
                                >
                                    Next →
                                </button>
                            </div>
                        )}
                    </div>
                )}

            </div>
        </div>
    );
}