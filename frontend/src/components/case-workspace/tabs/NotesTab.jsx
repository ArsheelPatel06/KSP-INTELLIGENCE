import React from 'react';
import { Bold, Italic, Paperclip, AtSign, Mic, MapPin, Link2, Sparkles, Send, Pin, User, Reply, CheckCircle2 } from 'lucide-react';
import { Btn, BtnIcon } from '../../common/ButtonSystem';

export const NotesTab = ({ fir, newNoteText, setNewNoteText, handleAddNoteSubmit }) => {
  return (
    <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
      
      {/* Rich Editor */}
      <div className="bg-white border border-gray-200 rounded-[16px] shadow-sm overflow-hidden focus-within:border-blue-400 focus-within:shadow-[0_0_0_3px_rgba(59,130,246,0.08)] transition-all">
        <textarea
          value={newNoteText}
          onChange={e => setNewNoteText(e.target.value)}
          placeholder="Enter field notes, witness interview observations, or forensic update..."
          rows={3}
          className="w-full bg-transparent p-4 text-[14px] text-slate-800 placeholder-slate-400 focus:outline-none resize-none"
        />
        <div className="bg-slate-50 border-t border-gray-100 p-2 flex items-center justify-between">
          <div className="flex items-center gap-1">
            <BtnIcon icon={Bold} variant="ghost" size="sm" />
            <BtnIcon icon={Italic} variant="ghost" size="sm" />
            <div className="w-px h-4 bg-gray-200 mx-1" />
            <BtnIcon icon={Paperclip} variant="ghost" size="sm" />
            <BtnIcon icon={AtSign} variant="ghost" size="sm" />
            <BtnIcon icon={Mic} variant="ghost" size="sm" />
            <BtnIcon icon={MapPin} variant="ghost" size="sm" />
            <BtnIcon icon={Link2} variant="ghost" size="sm" />
            <div className="w-px h-4 bg-gray-200 mx-1" />
            <Btn variant="ai" size="sm" icon={Sparkles}>AI Rewrite</Btn>
          </div>
          <Btn variant="primary" size="sm" icon={Send} onClick={handleAddNoteSubmit}>Save Note</Btn>
        </div>
      </div>

      {/* Notes Feed */}
      <div className="space-y-4">
        {fir.notes?.length === 0 ? (
          <div className="text-center py-10 border border-dashed border-gray-200 rounded-[16px] bg-slate-50">
            <p className="text-[13px] text-slate-500 font-medium">No investigation notes have been added.</p>
            <p className="text-[12px] text-slate-400 mb-4">Create your first field note.</p>
            <Btn variant="primary" size="sm" onClick={() => document.querySelector('textarea').focus()}>New Note</Btn>
          </div>
        ) : (
          fir.notes?.map((note, i) => (
            <div key={i} className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white shrink-0 mt-1">
                <User size={18} />
              </div>
              <div className="flex-1 bg-white border border-gray-200 rounded-[16px] rounded-tl-none p-4 shadow-sm relative group">
                <div className="absolute right-4 top-4 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <BtnIcon icon={Pin} variant="ghost" size="sm" />
                  <BtnIcon icon={Reply} variant="ghost" size="sm" />
                  <BtnIcon icon={CheckCircle2} variant="ghost" size="sm" />
                </div>
                
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[14px] font-extrabold text-slate-900">{note.author || 'Inspector Raj'}</span>
                  <span className="text-[11px] text-slate-400 font-mono">{note.timestamp || '2h ago'}</span>
                  {i === 0 && (
                    <span className="flex items-center gap-1 text-[10px] font-extrabold px-1.5 py-0.5 rounded-md border text-emerald-700 bg-emerald-50 border-emerald-200">
                      <Pin size={10} /> PINNED
                    </span>
                  )}
                </div>
                
                <p className="text-[14px] text-slate-700 leading-relaxed font-medium">
                  {note.text}
                </p>

                {/* Evidence link example */}
                {i === 0 && (
                  <div className="mt-3 p-2 bg-blue-50 border border-blue-100 rounded-[8px] flex items-center gap-2 inline-flex">
                    <FileCheck2 size={14} className="text-blue-600" />
                    <span className="text-[12px] font-bold text-blue-700">Linked: CCTV_Footage.mp4</span>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
