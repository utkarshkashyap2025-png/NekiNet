import React, { useState } from 'react';
import { X, UserCheck, Check, MapPin, Save } from 'lucide-react';
import type { VolunteerProfile } from '../../types';
import { AVAILABLE_SKILLS_LIST } from '../../data/mockData';

interface VolunteerProfileModalProps {
  profile: VolunteerProfile;
  isOpen: boolean;
  onClose: () => void;
  onSaveProfile: (updated: VolunteerProfile) => void;
}

export const VolunteerProfileModal: React.FC<VolunteerProfileModalProps> = ({
  profile,
  isOpen,
  onClose,
  onSaveProfile,
}) => {
  const [name, setName] = useState(profile.name);
  const [bio, setBio] = useState(profile.bio);
  const [radiusKm, setRadiusKm] = useState(profile.radiusKm);
  const [skills, setSkills] = useState<string[]>(profile.skills);
  const [isAvailable, setIsAvailable] = useState(profile.isAvailable);

  if (!isOpen) return null;

  const toggleSkill = (skillName: string) => {
    if (skills.includes(skillName)) {
      setSkills(skills.filter((s) => s !== skillName));
    } else {
      setSkills([...skills, skillName]);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveProfile({
      ...profile,
      name: name.trim() || profile.name,
      bio: bio.trim(),
      radiusKm,
      skills,
      isAvailable,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-xl w-full p-6 sm:p-7 shadow-2xl border border-slate-200 relative my-8 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">Volunteer Profile Setup</h2>
              <p className="text-xs text-slate-500">Configure your skills, radius & neighborhood presence</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="mt-5 space-y-5">
          
          {/* Availability switch */}
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <div>
              <span className="text-xs font-bold text-slate-900 block">
                Active Assistance Availability
              </span>
              <span className="text-[11px] text-slate-500">
                Turn on to receive nearby alerts when neighbors request help.
              </span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={isAvailable}
                onChange={(e) => setIsAvailable(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600" />
            </label>
          </div>

          {/* Full Name */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Full Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full text-xs sm:text-sm p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
            />
          </div>

          {/* Assistance Radius */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-teal-600" />
                <span>Assistance Coverage Radius</span>
              </label>
              <span className="text-xs font-extrabold text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200">
                Within {radiusKm} km
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mb-2">
              Only requests occurring within this approximate radius will be shown in your feed.
            </p>
            <div className="grid grid-cols-4 gap-2">
              {[1, 3, 5, 10].map((r) => (
                <button
                  type="button"
                  key={r}
                  onClick={() => setRadiusKm(r)}
                  className={`py-2 text-xs font-bold rounded-xl border transition ${
                    radiusKm === r
                      ? 'bg-teal-600 text-white border-teal-600 shadow-xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {r} km
                </button>
              ))}
            </div>
          </div>

          {/* Skills Checklist */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Verified & Selected Skills
            </label>
            <p className="text-[11px] text-slate-500 mb-2.5">
              Select the ways you are able to assist your neighbors:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {AVAILABLE_SKILLS_LIST.map((skill) => {
                const isSelected = skills.includes(skill);
                return (
                  <button
                    type="button"
                    key={skill}
                    onClick={() => toggleSkill(skill)}
                    className={`flex items-center gap-2 p-2.5 rounded-xl text-xs font-semibold text-left border transition ${
                      isSelected
                        ? 'bg-teal-50 text-teal-900 border-teal-300'
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className={`w-4 h-4 rounded-md flex items-center justify-center shrink-0 border ${
                      isSelected ? 'bg-teal-600 border-teal-600 text-white' : 'border-slate-300'
                    }`}>
                      {isSelected && <Check className="w-3 h-3" />}
                    </div>
                    <span className="truncate">{skill}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Bio */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Volunteer Bio / Availability Notes
            </label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="e.g. Local resident for 8 years. Available weekday evenings and weekends."
              className="w-full text-xs sm:text-sm p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
            />
          </div>

          {/* Actions */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-xl shadow-xs transition flex items-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Profile</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
