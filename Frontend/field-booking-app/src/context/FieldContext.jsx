import { createContext , useContext , useState , useEffect, Children, use } from "react";
import { getField } from "../api/submission";

const FieldContext = createContext();

export const FieldProvider = ({children}) => {
    const [fields, setFields] = useState([]);
    const [loading, setLoading] = useState(true); 

    const fetchFields = async () => {
        try {
            setLoading(true);
            const data = await getField(); 
            setFields(data);

        }catch (error){
            console.error("Không lấy được sân:", error);
        }
    }
    useEffect( () => {
        fetchFields();
        setLoading(false);
    }, []);

    return (
        <FieldContext.Provider value={{fields , loading , refreshFields : fetchFields}}>
            {children}
        </FieldContext.Provider>
    );
}

export const useField = () => useContext(FieldContext);