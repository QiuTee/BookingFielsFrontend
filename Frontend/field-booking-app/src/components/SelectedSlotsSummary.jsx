
function groupContinuousSlots(slots) {
  const sorted = slots.slice().sort();
  const groups = [];
  let start = sorted[0];
  let prev = start;

  for (let i = 1; i < sorted.length; i++) {
    const cur = sorted[i];
    const [ph, pm] = prev.split(":").map(Number);
    const [ch, cm] = cur.split(":").map(Number);
    const prevMin = ph * 60 + pm;
    const curMin = ch * 60 + cm;

    if (curMin - prevMin === 30) {
      prev = cur;
    } else {
      groups.push(`${start} - ${prev}`);
      start = cur;
      prev = cur;
    }
  }
  groups.push(`${start} - ${prev}`);
  return groups;
}

export default function SelectedSlotsSummary({ selectedCell }) {
  if (!selectedCell || selectedCell.length === 0) return <p>Không có khung giờ nào được chọn.</p>;

  const groupByField = selectedCell.reduce((acc, { field, slot }) => {
    if (!acc[field]) acc[field] = [];
    acc[field].push(slot);
    return acc;
  }, {});

  return (
    <div className="text-sm text-gray-800 mb-4">
      {Object.entries(groupByField).map(([field, slots]) => {
        const ranges = groupContinuousSlots(slots);
        return (
          <div key={field} className="mb-2">
            <strong>{field}:</strong>
            <ul className="list-disc ml-5">
              {ranges.map((range, idx) => (
                <li key={idx}>{range}</li>
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  );
}
