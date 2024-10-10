import axios from "axios";
import { useEffect, useState } from "react"


const useCatagory = () => {
    const [Catagory, setCatagory] = useState([]);

    const Catagories = async () => {
        try {
            const { data } = await axios.get('/api/catagory/get-categories');
            setCatagory(data?.catagories);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        Catagories();
    }, [])

    return Catagory;
}

export default useCatagory;