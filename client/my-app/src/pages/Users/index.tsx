import axios from "axios";
import { useEffect, useState } from "react";
import BaseButton from "../../components/BaseButton";
import { Pagination } from "@mui/material";
import "./Users.css";
import { FaUserSlash } from "react-icons/fa";
import Modal from "../../components/Modal";
import { UserProps } from "../../types";
import BaseSearch from "../../components/BaseSearch";
import { BsFilter } from "react-icons/bs";
import { useDebounce } from "use-debounce";
import { motion } from "motion/react";
import { CiExport } from "react-icons/ci";

type filter = "first_name" | "email";

const UsersPage = () => {
  const [data, setData] = useState<UserProps[]>([]);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [currentId, setCurrentId] = useState<number | null>(null);
  const [editVisible, setEditVsisible] = useState<boolean>(false);
  const [deleteVisible, setDeleteVisible] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [currentFilter, setCurrentFilter] = useState<filter>("first_name");
  const [searchValue, setSearchValue] = useState<string>("");
  const [debouncedSearch] = useDebounce(searchValue, 500);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (debouncedSearch) {
      searchUsers();
    } else {
      fetchData();
    }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  const searchUsers = async () => {
    const url = `http://localhost:3000/api/users/search?${currentFilter}=${searchValue}`;

    try {
      const response = await axios.get(url);
      setData(response.data);
    } catch (err: unknown) {
      console.log("Erro ao buscar usuário: ", err);
    }
  };

  const fetchData = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/users?page=1&limit=5"
      );
      setData(response.data.users);
      setTotalPages(response.data.totalPages);
    } catch (err) {
      console.log("Erro ao retornar usuário: ", err);
    }
  };

  const handleChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    changePage(value);
    setCurrentPage(value);
  };

  const changePage = async (page: number) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/users?page=${page}&limit=5`
      );
      setData(response.data.users);
      setTotalPages(response.data.totalPages);
    } catch (err) {
      console.log("Erro ao retornar usuário: ", err);
    }
  };

  const handleConfirm = () => {
    fetchData();
    setCurrentPage(1);
  };

  const exportUsers = async () => {
    try {
      //O servidor envia o CSV
      const response = await axios.get(
        "http://localhost:3000/api/users/export",
        {
          responseType: "blob",
        }
      );

      if (response.status !== 200) {
        throw new Error("Falha ao baixar o arquivo");
      }

      // Cria uma URL para o Blob
      const url = window.URL.createObjectURL(response.data);

      // Cria um link de download e clique programaticamente para iniciar o download
      const link = document.createElement("a");
      link.href = url;
      link.download = "users.csv";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Libera a URL criada após o download
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Erro ao fazer download:", error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="users-page"
    >
      {/* MODAL EDITAR USUÁRIO */}
      <Modal
        onConfirm={() => {
          handleConfirm();
          setEditVsisible(false);
        }}
        onClose={() => setEditVsisible(false)}
        action="edit"
        isOpen={editVisible}
        title="Editar usuário"
        userId={currentId}
      />

      {/* MODAL EXCLUIR USUÁRIO */}
      <Modal
        onConfirm={() => {
          handleConfirm();
          setDeleteVisible(false);
        }}
        onClose={() => setDeleteVisible(false)}
        action="delete"
        isOpen={deleteVisible}
        title="Excluir usuário"
        userId={currentId}
      />

      <div className="users-page__container">
        <div className="users-page__header">
          <BaseSearch
            placeholder={`Pesquisar pelo ${
              currentFilter == "first_name" ? "nome" : "E-mail"
            }... `}
            onChange={(e) => setSearchValue(e.target.value)}
            className="users-page__search"
          />
          <span
            onClick={() => setCurrentFilter("first_name")}
            className={`users-page__filter ${
              currentFilter == "first_name"
                ? "users-page__filter--selected"
                : ""
            }`.trim()}
          >
            <BsFilter /> Primeiro nome
          </span>
          <span
            onClick={() => setCurrentFilter("email")}
            className={`users-page__filter ${
              currentFilter == "email" ? "users-page__filter--selected" : ""
            }`.trim()}
          >
            <BsFilter /> Email
          </span>
          <BaseButton
            onClick={() => exportUsers()}
            className="ml-auto users-page__export-btn"
            variant="primary"
            icon={<CiExport />}
          >
            Exportar como CSV
          </BaseButton>
        </div>
        {data.length > 0 ? (
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
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {data?.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <img
                        src={item.avatar}
                        width={80}
                        alt="Avatar do usuário"
                      />
                    </td>
                    <td>{item.first_name}</td>
                    <td>{item.email}</td>
                    <td>{item.city}</td>
                    <td>{item.gender}</td>
                    <td>{item.phone_number}</td>
                    <td>
                      <div className="home__action-btns">
                        <BaseButton
                          variant="primary"
                          onClick={() => {
                            setCurrentId(item.id);
                            setEditVsisible(true);
                          }}
                        >
                          Editar
                        </BaseButton>
                        <BaseButton
                          onClick={() => {
                            setCurrentId(item.id);
                            setDeleteVisible(true);
                          }}
                          variant="secondary"
                        >
                          Excluir
                        </BaseButton>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="users-page__empty-table">
            <h1 className="font-light text-2xl">Nenhum usuário encontrado.</h1>
            <span>
              <FaUserSlash size={30} />
            </span>
          </div>
        )}
        {data.length > 0 && (
          <Pagination
            className="mt-auto"
            onChange={handleChange}
            variant="outlined"
            color="primary"
            style={{ margin: "auto" }}
            count={totalPages}
            page={currentPage}
          />
        )}
      </div>
    </motion.div>
  );
};

export default UsersPage;
