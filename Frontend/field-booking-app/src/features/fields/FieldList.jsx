import FieldCard from "./FieldCard";

export default function FieldList({ fields , onCardClick , favorites, handleFavoriteToggle }) {
    return (
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-8 px-4">
            {fields.map((field) => (
               <FieldCard key={field.id} field={field} onClick={onCardClick} isFavorite ={favorites.includes(field.id)} handleFavoriteToggle={() => handleFavoriteToggle(field.id)}/>
            ))}
        </div>
    );
}