import { useEffect, useState } from "react";
import axios from "axios";
import BaseButton from "../../components/BaseButton";
import "./Home.css";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { BsSave } from "react-icons/bs";
import { motion } from "motion/react";
import BaseImage from "../../components/BaseImage";

interface User {
  avatar: string;
  first_name: string;
  email: string;
  address: Address;
  gender: string;
  phone_number: string;
  id: number;
}

interface Address {
  city: string;
}

const Home = () => {
  const [data, setData] = useState<User[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        "https://random-data-api.com/api/v2/users?size=5"
      );
      setData(response.data);
    } catch (err) {
      console.log("Erro ao retornar usuário: ", err);
    }
  };

  const saveData = async () => {
    const users = data.map(
      ({ id, avatar, first_name, email, address, gender, phone_number }) => ({
        id,
        avatar,
        first_name,
        email,
        city: address.city,
        gender,
        phone_number,
      })
    );
    const savePromise = axios.post("http://localhost:3000/api/save", users, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    toast.promise(savePromise, {
      pending: "Salvando dados...",
      success: "Dados salvos com sucesso!",
      error: "Erro ao salvar os dados.",
    });

    try {
      await savePromise;
      navigate("/usuarios");
    } catch (err) {
      console.error("Erro ao salvar usuários:", err);
    }
  };

  return (
    <motion.div
      className="home"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="home__container">
        <div className="default-table">
          <table>
            <thead>
              <tr>
                <th>Avatar</th>
                <th>Primeiro nome</th>
                <th>E-mail</th>
                <th>Cidade</th>
                <th>Gênero</th>
                <th>Número</th>
              </tr>
            </thead>
            <tbody>
              {data?.map((item) => (
                <tr key={item.id}>
                  <td>
                    <BaseImage
                      width={80}
                      alt={item.first_name}
                      src={item.avatar}
                    />
                  </td>
                  <td>{item.first_name}</td>
                  <td>{item.email}</td>
                  <td>{item.address.city}</td>
                  <td>{item.gender}</td>
                  <td>{item.phone_number}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <BaseButton
          icon={<BsSave />}
          onClick={() => saveData()}
          className="home__save-btn"
          variant="primary"
        >
          Gravar dados
        </BaseButton>
      </div>
    </motion.div>
  );
};

export default Home;
