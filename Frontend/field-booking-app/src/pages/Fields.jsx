import { useEffect, useState } from "react";
import FieldList from "../features/fields/FieldList";
import FieldFilter from "../features/fields/FieldFilter";
import FieldModal from "../features/fields/FieldModal";
import { getAllFields } from "../api/submission";   

export default function Fields() {
  const [filters, setFilters] = useState({
    search: "",
    type: "",
    onlyFavorites: false,
  });
  const [fields, setFields] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedField, setSelectedField] = useState(null);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const fetchFields = async () => {
      try {
        setLoading(true);
        const data = await getAllFields();
        setFields(data);
        console.log(data)
      } catch (error) {
        console.error("Không lấy được danh sách sân:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFields();
  }, []);

  const filteredFields = fields.filter((field) => {
    const matchSearch = filters.search === "" || field.name.toLowerCase().includes(filters.search.toLowerCase());
    const matchType = filters.type === "" || field.type === filters.type;
    const matchFavorites = !filters.onlyFavorites || favorites.includes(field.id);
    return matchSearch && matchType && matchFavorites;
  });

  const handleFavoriteToggle = (fieldId) => {
    setFavorites((prev) =>
      prev.includes(fieldId) ? prev.filter((id) => id !== fieldId) : [...prev, fieldId]
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <FieldFilter filters={filters} onChange={setFilters} />
      {loading ? (
        <p className="text-center py-8 text-blue-600">Đang tải danh sách sân...</p>
      ) : (
        <FieldList
          fields={filteredFields}
          onCardClick={(field) =>
            setSelectedField({
                ...field,
                bookingLink: `/san/${field.slug}`
            })
            }
          favorites={favorites}
          handleFavoriteToggle={handleFavoriteToggle}
        />
      )}
      <FieldModal field={selectedField} onClose={() => setSelectedField(null)} />
    </div>
  );
}
