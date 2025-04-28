import { useState } from "react";
import fieldData from "../data/FieldData.js";
import FieldList from "../features/fields/FieldList";
import FieldFilter from "../features/fields/FieldFilter";
import FieldModal from "../features/fields/FieldModal.jsx";
export default function Fields() {
    const [filters , setFilters] = useState({
        search: "",
        type: "",
        onlyFavorites: false,
    });
    const [selectedField, setSelectedField] = useState(null);
    const [favorites, setFavorites] = useState([]);
    const filterFields = fieldData.filter((field) => {
        const matchSearch = filters.search === "" || field.name.toLowerCase().includes(filters.search.toLowerCase());
        const matchType = filters.type === "" || field.type === filters.type;
        const matchFavorites = !filters.onlyFavorites || favorites.includes(field.id);
        return matchSearch && matchType && matchFavorites;
      });
    
    const handleFavoriteToggle = (fieldId) => {
        setFavorites((prevFavorites) => {
            if (prevFavorites.includes(fieldId)) {
                return prevFavorites.filter((id) => id !== fieldId);
            } else {
                return [...prevFavorites, fieldId];
            }
        });
    }
    
    return (
        <div className="min-h-screen bg-gray-50">
            <FieldFilter filters={filters} onChange={setFilters} />
            <FieldList fields={filterFields} onCardClick={setSelectedField} favorites = {favorites} handleFavoriteToggle = {handleFavoriteToggle}  />
            <FieldModal field={selectedField} onClose={() => setSelectedField(null)} />
        </div>
    )
}