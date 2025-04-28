import fs from "fs";
import csv from "csv-parser";
import path from "path";
import { fileURLToPath } from "url";

const getFilePath = () => {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const FILE_PATH = path.join(__dirname, "../data", "users.csv");

  return FILE_PATH;
};

export const getUsers = (req, res) => {
  const FILE_PATH = getFilePath();

  // Verifica se o arquivo existe
  if (!fs.existsSync(FILE_PATH)) {
    return res.status(404).json({ error: "Arquivo não encontrado." });
  }

  const users = [];

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;

  fs.createReadStream(FILE_PATH)
    .pipe(csv())
    .on("data", (row) => {
      users.push(row);
    })
    .on("end", () => {
      const paginatedUsers = users.slice(startIndex, endIndex);
      res.status(200).json({
        page,
        limit,
        total: users.length,
        totalPages: Math.ceil(users.length / limit),
        users: paginatedUsers,
      });
    })
    .on("error", (err) => {
      res.status(500).json({ error: "Erro ao ler o arquivo CSV." });
    });
};

export const editUser = (req, res) => {
  const FILE_PATH = getFilePath();
  const updatedUser = req.body.data;

  if (!updatedUser || !updatedUser.id) {
    return res.status(400).json({ error: "Dados inválidos para edição." });
  }

  const users = [];

  fs.createReadStream(FILE_PATH)
    .pipe(csv())
    .on("data", (row) => {
      if (row.id === updatedUser.id) {
        // Atualiza só os campos enviados, mantém os outros
        users.push({ ...row, ...updatedUser });
      } else {
        users.push(row);
      }
    })
    .on("end", () => {
      const header = Object.keys(users[0]).join(",") + "\n";

      const escapeCSV = (val) => {
        if (typeof val !== "string") val = String(val);
        if (val.includes(",") || val.includes('"')) {
          return `"${val.replace(/"/g, '""')}"`;
        }
        return val;
      };

      const lines =
        users
          .map((user) => Object.values(user).map(escapeCSV).join(","))
          .join("\n") + "\n";

      fs.writeFile(FILE_PATH, header + lines, (err) => {
        if (err) return res.status(500).json({ error: "Erro ao salvar." });
        res.status(200).json({ message: "Usuário atualizado com sucesso!" });
      });
    })
    .on("error", () => {
      res.status(500).json({ error: "Erro ao ler o CSV." });
    });
};

export const exportUsers = (req, res) => {
  const FILE_PATH = getFilePath();

  if (fs.existsSync(FILE_PATH)) {
    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", 'attachment; filename="data.csv"');
    fs.createReadStream(FILE_PATH).pipe(res);
  } else {
    res.status(404).json({ error: "Arquivo não encontrado." });
  }
};

export const getUserBySearch = (req, res) => {
  const { first_name = "", email = "" } = req.query;
  const results = [];
  const FILE_PATH = getFilePath();

  fs.createReadStream(FILE_PATH)
    .pipe(csv())
    .on("data", (row) => {
      const matchName = row.first_name
        .toLowerCase()
        .includes(first_name.toLowerCase());
      const matchEmail = row.email.toLowerCase().includes(email.toLowerCase());

      // Se ambos foram passados, filtra por ambos
      if ((first_name && matchName) || (email && matchEmail)) {
        results.push(row);
      }
    })
    .on("end", () => {
      res.status(200).json(results);
    })
    .on("error", (err) => {
      res.status(500).json({ error: "Erro ao buscar usuários." });
    });
};

export const deleteUser = (req, res) => {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ error: "ID é obrigatório." });
  }

  const FILE_PATH = getFilePath();
  const users = [];

  fs.createReadStream(FILE_PATH)
    .pipe(csv())
    .on("data", (row) => {
      //Escreve todas as linhas, exceto a que possuí o id recebido
      if (row.id !== id) {
        users.push(row);
      }
    })
    .on("end", () => {
      if (users.length === 0) {
        return res.status(404).json({ error: "Usuário não encontrado." });
      }

      const header = Object.keys(users[0]).join(",") + "\n";

      const escapeCSV = (val) => {
        if (typeof val !== "string") val = String(val);
        if (val.includes(",") || val.includes('"')) {
          return `"${val.replace(/"/g, '""')}"`;
        }
        return val;
      };

      const lines =
        users
          .map((user) => Object.values(user).map(escapeCSV).join(","))
          .join("\n") + "\n";

      fs.writeFile(FILE_PATH, header + lines, (err) => {
        if (err) {
          return res.status(500).json({ error: "Erro ao salvar o arquivo." });
        }
        res.status(200).json({ message: "Usuário deletado com sucesso!" });
      });
    })
    .on("error", () => {
      res.status(500).json({ error: "Erro ao ler o CSV." });
    });
};

export const getUserById = (req, res) => {
  const FILE_PATH = getFilePath();

  const id = req.query.id;
  let user = [];

  fs.createReadStream(FILE_PATH)
    .pipe(csv())
    .on("data", (row) => {
      if (row.id == id) user = row;
    })
    .on("end", () => {
      // Quando terminar, retorna todos os dados como JSON
      res.status(200).json({ user });
    })
    .on("error", (err) => {
      // Se der erro durante a leitura
      res.status(500).json({ error: "Erro ao ler o arquivo CSV." });
    });
};

export const writeFile = (req, res) => {
  const newData = req.body;

  if (!Array.isArray(newData) || newData.length === 0) {
    return res.status(400).json({ error: "Lista de usuários inválida." });
  }

  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const FILE_PATH = path.join(__dirname, "../data", "users.csv");

  const existingUsers = [];

  // Verifica se o arquivo já existe
  const readStream = fs.existsSync(FILE_PATH)
    ? fs.createReadStream(FILE_PATH).pipe(csv())
    : null;

  if (readStream) {
    readStream
      .on("data", (row) => {
        existingUsers.push(row);
      })
      .on("end", () => {
        appendUsers(existingUsers);
      });
  } else {
    appendUsers([]);
  }

  function appendUsers(existing) {
    const newRows = newData.map((user) => {
      return `${user.id},${user.avatar},${user.first_name},${user.email},${user.city},${user.gender},${user.phone_number}`;
    });

    const header = "id,avatar,first_name,email,city,gender,phone_number\n";
    const content =
      (existing.length === 0 ? header : "") + newRows.join("\n") + "\n";

    fs.appendFile(FILE_PATH, content, (err) => {
      if (err) {
        return res
          .status(500)
          .json({ error: "Erro ao escrever no arquivo CSV." });
      }
      res.status(201).json({
        message: "Dados adicionados com sucesso!",
        count: newData.length,
      });
    });
  }
};
