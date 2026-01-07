import React, { memo } from 'react';
import useWishStore from '@/store/useWishStore';
import { Heart } from 'lucide-react';

const WishButton = ({ item, customClass='absolute top-3 right-3' }) => {
    // FIX: Hook called unconditionally at the top level
    const { wishes, addWish, removeWish } = useWishStore();

    // Now safe to return early
    if (!item) return null;

    const isInWishlist = wishes.some((w) => w.id === item.id);

    const handleWishlistToggle = (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (isInWishlist) {
            removeWish(item.id);
        } else {
            addWish(item);
        }
    };

    return (
        <button
            onClick={handleWishlistToggle}
            className={`
                ${customClass} p-2  rounded-full 
                transition-all shadow-sm backdrop-blur-sm
                ${isInWishlist
                    ? 'bg-red-50 text-red-500 hover:bg-red-100'
                    : 'bg-white/80 text-gray-400 hover:bg-white hover:text-red-500'
                }
            `}
            aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
        >
            <Heart
                size={18}
                className="transition-colors"
                fill={isInWishlist ? "currentColor" : "none"}
            />
        </button>
    );
};

export default memo(WishButton);