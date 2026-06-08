'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Star, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const WatchlistButton = ({
  symbol,
  company,
  isInWatchlist,
  showTrashIcon,
  type = 'button',
  onWatchlistChange,
}: WatchlistButtonProps) => {
  const [isAdded, setIsAdded] = React.useState(isInWatchlist);

  const handleToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // In a real app, we would call an action here
    const newStatus = !isAdded;
    setIsAdded(newStatus);
    
    if (onWatchlistChange) {
      onWatchlistChange(symbol, newStatus);
    }
  };

  if (type === 'icon') {
    return (
      <button
        onClick={handleToggle}
        className={cn(
          "p-2 rounded-full transition-colors",
          isAdded ? "text-yellow-500" : "text-gray-400 hover:text-yellow-500"
        )}
      >
        {showTrashIcon && isAdded ? (
          <Trash2 className="h-5 w-5" />
        ) : (
          <Star className={cn("h-5 w-5", isAdded && "fill-current")} />
        )}
      </button>
    );
  }

  return (
    <Button
      onClick={handleToggle}
      className={cn(
        "watchlist-btn",
        isAdded && "bg-yellow-500/10 border-yellow-500/50 text-yellow-500 hover:bg-yellow-500/20" 
      )}
    >
      {isAdded ? (
        <>
          <Star className="h-4 w-4 fill-current" />
          <span>In Watchlist</span>
        </>
      ) : (
        <>
          <Star className="h-4 w-4" />
          <span>Add to Watchlist</span>
        </>
      )}
    </Button>
  );
};

export default WatchlistButton;
