import React, { useState } from 'react';
import { X, Star, Heart, Send } from 'lucide-react';
import type { HelpRequest } from '../../types';

interface FeedbackModalProps {
  request: HelpRequest | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmitFeedback: (requestId: string, rating: number, comment: string) => void;
}

export const FeedbackModal: React.FC<FeedbackModalProps> = ({
  request,
  isOpen,
  onClose,
  onSubmitFeedback,
}) => {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');

  if (!isOpen || !request) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) {
      alert('Please add a short note of feedback or thanks.');
      return;
    }
    onSubmitFeedback(request.id, rating, comment.trim());
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 relative animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-100 text-amber-700">
              <Star className="w-5 h-5 fill-amber-500 text-amber-500" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Volunteer Feedback</h3>
              <p className="text-xs text-slate-500">Rate your experience with {request.volunteerName || 'your volunteer'}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          
          {/* Star selector */}
          <div className="text-center py-2">
            <label className="text-xs font-semibold text-slate-600 block mb-2">
              Select your rating
            </label>
            <div className="flex items-center justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="p-1 text-2xl transition transform hover:scale-110 focus:outline-none"
                >
                  <Star
                    className={`w-8 h-8 ${
                      (hoverRating || rating) >= star
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-slate-300'
                    }`}
                  />
                </button>
              ))}
            </div>
            <p className="text-xs text-slate-500 mt-2 font-medium">
              {rating === 5 && '🌟 Outstanding & Heartwarming'}
              {rating === 4 && '👍 Great help, very reliable'}
              {rating === 3 && '👌 Satisfactory assistance'}
              {rating === 2 && '⚠️ Needs improvement'}
              {rating === 1 && '❌ Unsatisfactory'}
            </p>
          </div>

          {/* Comment / Note */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Gratitude note or comments *
            </label>
            <textarea
              required
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="e.g. Aarav arrived promptly and was so respectful and patient with my mother. Thank you for making our neighborhood safer!"
              className="w-full text-xs sm:text-sm p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
            />
          </div>

          <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs transition flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Submit Review</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
