import React from 'react';
import { Scissors } from 'lucide-react';

export default function BarbersSkeleton() {
    return (
        <div className="pb-10 px-4 md:px-8 pt-6 animate-pulse">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-10 px-4 md:px-8">
                <div>
                    <div className="flex items-center gap-3">
                        <Scissors className="text-white/20" size={32} />
                        <div className="h-10 w-48 bg-white/10 rounded-xl"></div>
                    </div>
                    <div className="h-4 w-64 bg-white/5 rounded-md mt-4"></div>
                </div>

                <div className="flex gap-3">
                    <div className="w-[50px] h-[50px] bg-white/5 border border-white/10 rounded-2xl"></div>
                    <div className="w-40 h-[50px] bg-[#E5B454]/20 border border-[#E5B454]/10 rounded-2xl"></div>
                </div>
            </div>

            {/* Main Content Pane */}
            <div className="relative rounded-[2.5rem] overflow-hidden border border-white/10 bg-white/5 backdrop-blur-md h-[500px]">
                <div className="p-6 border-b border-white/5">
                    <div className="h-12 w-full max-w-sm bg-black/20 rounded-2xl"></div>
                </div>

                <div className="p-8 space-y-6">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="flex items-center justify-between py-4 border-b border-white/5 last:border-0">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-white/10"></div>
                                <div className="h-4 w-32 bg-white/10 rounded-md"></div>
                            </div>
                            <div className="h-4 w-24 bg-white/10 rounded-md hidden md:block"></div>
                            <div className="h-4 w-20 bg-white/10 rounded-md hidden md:block"></div>
                            <div className="w-8 h-8 rounded-xl bg-white/10"></div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
