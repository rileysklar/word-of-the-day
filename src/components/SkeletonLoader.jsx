function SkeletonLoader() {
    return (
      <div className="bg-gray-100 p-4 rounded shadow-md animate-pulse">
        {/* Title Placeholder */}
        <div className="h-8 bg-gray-300 rounded w-1/3 mb-4"></div>
        
        {/* Description Placeholder */}
        <div className="h-4 bg-gray-300 rounded w-full mb-2"></div>
        <div className="h-4 bg-gray-300 rounded w-5/6 mb-2"></div>
        
        {/* More Info Toggle Placeholder */}
        <div className="h-4 bg-gray-300 rounded w-1/4 mb-4"></div>
        
        {/* Divider */}
        <div className="h-[1px] bg-gray-300 w-full mb-4"></div>
        
        {/* Part of Speech Placeholder */}
        <div className="h-4 bg-gray-300 rounded w-1/3"></div>
      </div>
    );
  }
  
export default SkeletonLoader  