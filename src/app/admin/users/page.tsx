"use client";

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchAllUsers, updateUserRole } from "@/store/slices/authSlice";
import { Shield, UserCheck, AlertTriangle } from "lucide-react";

export default function AdminUsersPage() {
  const dispatch = useAppDispatch();
  const { users, usersLoading, usersError } = useAppSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchAllUsers());
  }, [dispatch]);

  const handleToggleRole = async (userId: string, currentStatus: boolean) => {
    const resultAction = await dispatch(
      updateUserRole({ userId, isAdmin: !currentStatus })
    );
    if (updateUserRole.fulfilled.match(resultAction)) {
      // Successfully updated in store state
    } else {
      alert(resultAction.payload || "Failed to update user role.");
    }
  };

  if (usersLoading) {
    return (
      <div className="max-w-6xl mx-auto py-20 text-center font-mono text-amber-500 animate-pulse text-sm tracking-widest">
        FETCHING USER CLEARANCE RECORDS...
      </div>
    );
  }

  if (usersError) {
    return (
      <div className="max-w-6xl mx-auto py-20 text-center font-mono text-red-500 space-y-4">
        <div className="flex items-center justify-center gap-2">
          <AlertTriangle className="w-5 h-5" />
          <p className="text-sm uppercase">{usersError}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 font-mono space-y-6 text-white">
      <div className="border-b border-gray-800 pb-4 flex justify-between items-center">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-amber-500 uppercase tracking-wider">
            User Clearance & Access Control
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Manage system permissions and administrator privileges.
          </p>
        </div>
        <div className="text-xs bg-amber-500/10 text-amber-500 px-3 py-1.5 rounded border border-amber-500/20 font-bold">
          Total Users: {users.length}
        </div>
      </div>

      <div className="bg-[#0b0f19] border border-gray-800 rounded-lg overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-gray-800 bg-gray-900/60 text-gray-400 uppercase tracking-widest text-[10px]">
                <th className="p-4">Username</th>
                <th className="p-4">Email</th>
                <th className="p-4">Status / Role</th>
                <th className="p-4 text-right">Action Controls</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/50">
              {users.map((u) => (
                <tr key={u._id} className="hover:bg-gray-900/30 transition-colors">
                  <td className="p-4 font-bold text-gray-200 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                    {u.username}
                  </td>
                  <td className="p-4 text-gray-400">{u.email}</td>
                  <td className="p-4">
                    {u.isAdmin ? (
                      <span className="text-amber-500 bg-amber-500/10 px-2.5 py-1 rounded border border-amber-500/20 font-bold inline-flex items-center gap-1.5 uppercase text-[10px]">
                        <Shield className="w-3 h-3" /> Admin
                      </span>
                    ) : (
                      <span className="text-gray-400 bg-gray-800/60 px-2.5 py-1 rounded inline-flex items-center gap-1.5 uppercase text-[10px]">
                        <UserCheck className="w-3 h-3 text-gray-400" /> Normal User
                      </span>
                    )}
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => handleToggleRole(u._id, u.isAdmin)}
                      className={`px-3 py-1.5 rounded font-bold transition-all text-[10px] uppercase tracking-wider ${
                        u.isAdmin
                          ? "bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20"
                          : "bg-amber-500/10 text-amber-500 border border-amber-500/20 hover:bg-amber-500/20"
                      }`}
                    >
                      {u.isAdmin ? "Revoke Admin" : "Grant Admin"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}