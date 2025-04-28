import React, { useEffect, useState } from "react";
import "./Modal.css";
import axios from "axios";
import { UserProps } from "../../types";
import InputField from "../InputField";
import BaseButton from "../BaseButton";
import { BsCheckCircle } from "react-icons/bs";
import { MdOutlineCancel } from "react-icons/md";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { AnimatePresence, motion } from "motion/react";
import { toast } from "react-toastify";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  children?: React.ReactNode;
  action: "edit" | "delete";
  userId: number | null;
}

type Inputs = {
  first_name: string;
  email: string;
  city: string;
  gender: string;
  phone_number: string;
};

const Modal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  action,
  userId,
}: ModalProps) => {
  const [user, setUser] = useState<UserProps>();
  const {
    reset,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  //Fecha o modal ao apertar ESC...
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    const fetchUser = async () => {
      if (isOpen && userId !== null) {
        try {
          const response = await axios.get(
            `http://localhost:3000/api/user?id=${userId}`
          );
          setUser(response.data.user);
        } catch (err: unknown) {
          console.error("Erro ao retornar usuário:", err);
        }
      }
    };
    fetchUser();
  }, [isOpen, userId]);

  useEffect(() => {
    //Atualiza os valores padrões após o user ser carregado...
    if (user) {
      reset({
        first_name: user.first_name,
        email: user.email,
        city: user.city,
        gender: user.gender,
        phone_number: user.phone_number,
      });
    }
  }, [user, reset]);

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    const editPromise = axios.put("http://localhost:3000/api/user/edit", {
      data: { id: userId, ...data },
    });

    toast.promise(editPromise, {
      pending: "Editando usuário...",
      success: "Usuário editado com sucesso!",
      error: "Erro ao editar usuário.",
    });

    try {
      await editPromise;
      onConfirm();
    } catch (err: unknown) {
      console.log("Erro ao editar usuário:", err);
    }
  };

  const handleDelete = async () => {
    const deletePromise = axios.delete(`http://localhost:3000/api/user/delete?id=${userId}`);

    toast.promise(deletePromise, {
      pending: "Excluindo usuário...",
      success: "Usuário excluido com sucesso!",
      error: "Erro ao excluir usuário.",
    });

    try {
      await deletePromise;
      onConfirm();
    } catch (err: unknown) {
      console.log("Erro ao deletar usuário:", err);
    }
  }

  const handleConfirm = () => {
    if (action === "edit")
      handleSubmit(onSubmit)();
    else
    handleDelete();
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="modal-overlay"
          onClick={onClose}
        >
          <motion.div
            className="modal-content"
            initial={{ opacity: 0, y: -100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            transition={{ duration: 0.3 }}
            onClick={(e: React.MouseEvent<HTMLDivElement, MouseEvent>) =>
              e.stopPropagation()
            }
          >
            <div className="modal-header">
              <h2 className="text-xl">{title}</h2>
              <button className="close-btn" onClick={onClose}>
                &times;
              </button>
            </div>
            {action === "delete" && (
              <div className="modal-body__delete">
                <img
                  className="shadow-xl user-avatar"
                  src={user?.avatar}
                  alt="Imagem do usuário"
                  width={200}
                />
                <h1 className="text-xl font-semibold">{user?.first_name}</h1>
                <p className="max-w-90 text-red-600 bg-red-100 p-5 rounded text-sm border-1">
                  Tem certeza que deseja excluir este usuário? Essa ação não
                  pode ser desfeita.
                </p>
              </div>
            )}
            {action === "edit" && (
              <div className="modal-body__edit">
                <img
                  className="shadow-xl user-avatar"
                  src={user?.avatar}
                  alt="Imagem do usuário"
                  width={200}
                />
                <div className="modal-body__edit__content">
                  <form>
                    <Controller
                      name="first_name"
                      control={control}
                      defaultValue={user?.first_name || ""}
                      rules={{ required: true }}
                      render={({ field }) => (
                        <InputField
                          error={errors.first_name !== undefined}
                          label="Primeiro nome"
                          placeholder="Digite o primeiro nome do usuário..."
                          {...field}
                        />
                      )}
                    />
                    <Controller
                      name="email"
                      control={control}
                      defaultValue={user?.email || ""}
                      rules={{ required: true }}
                      render={({ field }) => (
                        <InputField
                          error={errors.email !== undefined}
                          label="E-mail"
                          placeholder="Digite o e-mail do usuário..."
                          {...field}
                        />
                      )}
                    />
                    <Controller
                      name="city"
                      control={control}
                      defaultValue={user?.city || ""}
                      rules={{ required: true }}
                      render={({ field }) => (
                        <InputField
                          error={errors.city !== undefined}
                          label="Cidade"
                          placeholder="Digite a cidade do usuário..."
                          {...field}
                        />
                      )}
                    />
                    <Controller
                      name="gender"
                      control={control}
                      defaultValue={user?.gender || ""}
                      rules={{ required: true }}
                      render={({ field }) => (
                        <InputField
                          error={errors.gender !== undefined}
                          label="Gênero"
                          placeholder="Digite o gênero do usuário..."
                          {...field}
                        />
                      )}
                    />
                    <Controller
                      name="phone_number"
                      control={control}
                      defaultValue={user?.phone_number || ""}
                      rules={{ required: true }}
                      render={({ field }) => (
                        <InputField
                          error={errors.phone_number !== undefined}
                          label="Número"
                          placeholder="Digite o gênero do usuário..."
                          {...field}
                        />
                      )}
                    />
                  </form>
                </div>
              </div>
            )}

            <div className="modal-footer">
              <BaseButton
                onClick={onClose}
                icon={<MdOutlineCancel />}
                variant="secondary"
              >
                Cancelar
              </BaseButton>
              <BaseButton
                onClick={() =>  handleConfirm()}
                icon={<BsCheckCircle />}
                variant="primary"
                type="submit"
              >
                Confirmar
              </BaseButton>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Modal;
