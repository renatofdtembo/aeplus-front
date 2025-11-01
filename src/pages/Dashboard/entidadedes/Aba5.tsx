import { useEffect } from "react";
import { Entidade } from "../../../services/classes/Entidade";

interface Aba1Props {
    entidade: Entidade
}
const Aba5: React.FC<Aba1Props> = ({entidade}) => {
    
    useEffect(() => {
        async function Inicializar() {
            try {
                console.log(entidade)
            } catch (error) {
                console.error("Error loading profile:", error);
            }
        }

        Inicializar();
    }, []);

    return (
        <>
            
        </>
    )
};

export default Aba5;