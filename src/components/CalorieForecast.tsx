import React from 'react';

interface Props {
  maintenance: number;    
  intake: number;         
  goalKg: number;         
}

const CalorieForecast: React.FC<Props> = ({ maintenance, intake, goalKg }) => {
  
  const diff = intake - maintenance;
  const label = diff > 0 ? 'Nadwyżka' : 'Deficyt';

  const weeklyChangeKg = (diff * 7) / 7000;
  const changeLabel = diff > 0 ? 'Przyrost masy' : 'Utrata masy';

  const weeksToGoal = Math.ceil(goalKg / Math.abs(weeklyChangeKg));

  return (
    <>
      <div className="mb-4">
        <span className="font-semibold">{label}:</span>&nbsp;
        {Math.abs(diff)} kcal/dzień
      </div>
      <div className={`p-4 rounded-lg text-white ${diff > 0 ? 'bg-green-500' : 'bg-orange-500'}`}>
        <h4 className="font-bold mb-2">{changeLabel}</h4>
        <div className="text-3xl mb-1">
          {Math.abs(weeklyChangeKg).toFixed(1)} kg na tydzień
        </div>
        <p className="text-sm">
          Osiągniesz cel ({goalKg} kg) w ok. {weeksToGoal} tygodni
        </p>
      </div>
    </>
  );
};

export default CalorieForecast;
