const StatsCard = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon;

        return (
          <div key={index} className={`${stat.bgColor} rounded-lg p-6 relative overflow-hidden`}>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className={`${stat.color} rounded-lg p-3`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
              </div>

              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-1">
                  {stat.value}
                </h3>
                <p className="text-gray-600 text-sm font-medium">
                  {stat.title}
                </p>
              </div>
            </div>

            {/* Background decoration */}
            <div className="absolute top-0 right-0 -mr-4 -mt-4 opacity-20">
              <Icon className="h-24 w-24 text-gray-500" />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StatsCard;
