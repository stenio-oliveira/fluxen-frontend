import type { Equipamento } from "../types/Equipamento";
import type { Usuario } from "../types/Usuario";

const equipamentosMockData: Equipamento[] = [
  {
    id: 1,
    nome: "Equipamento A",
    id_usuario: 101,
    cliente_nome: "Cliente 1",
    cliente: [
      {
        id: 101,
        nome: "Cliente 1",
        email: "cliente1@example.com",
        senha: "senha1",
        username: "cliente1",
      },
    ],
  },
  {
    id: 2,
    nome: "Equipamento B",
    id_usuario: 102,
    cliente_nome: "Cliente 2",
    cliente: [
      {
        id: 102,
        nome: "Cliente 2",
        email: "cliente2@example.com",
        senha: "senha2",
        username: "cliente2",
      },
    ],
  },
  {
    id: 3,
    nome: "Equipamento C",
    id_usuario: 103,
    cliente_nome: "Cliente 3",
    cliente: [
      {
        id: 103,
        nome: "Cliente 3",
        email: "cliente3@example.com",
        senha: "senha3",
        username: "cliente3",
      },
    ],
  },
  {
    id: 4,
    nome: "Equipamento D",
    id_usuario: 104,
    cliente_nome: "Cliente 4",
    cliente: [
      {
        id: 104,
        nome: "Cliente 4",
        email: "cliente4@example.com",
        senha: "senha4",
        username: "cliente4",
      },
    ],
  },
  {
    id: 5,
    nome: "Equipamento E",
    id_usuario: 105,
    cliente_nome: "Cliente 5",
    cliente: [
      {
        id: 105,
        nome: "Cliente 5",
        email: "cliente5@example.com",
        senha: "senha5",
        username: "cliente5",
      },
    ],
  },
  {
    id: 6,
    nome: "Equipamento F",
    id_usuario: 106,
    cliente_nome: "Cliente 6",
    cliente: [
      {
        id: 106,
        nome: "Cliente 6",
        email: "cliente6@example.com",
        senha: "senha6",
        username: "cliente6",
      },
    ],
  },
  {
    id: 7,
    nome: "Equipamento G",
    id_usuario: 107,
    cliente_nome: "Cliente 7",
    cliente: [
      {
        id: 107,
        nome: "Cliente 7",
        email: "cliente7@example.com",
        senha: "senha7",
        username: "cliente7",
      },
    ],
  },
  {
    id: 8,
    nome: "Equipamento H",
    id_usuario: 108,
    cliente_nome: "Cliente 8",
    cliente: [
      {
        id: 108,
        nome: "Cliente 8",
        email: "cliente8@example.com",
        senha: "senha8",
        username: "cliente8",
      },
    ],
  },
  {
    id: 9,
    nome: "Equipamento I",
    id_usuario: 109,
    cliente_nome: "Cliente 9",
    cliente: [
      {
        id: 109,
        nome: "Cliente 9",
        email: "cliente9@example.com",
        senha: "senha9",
        username: "cliente9",
      },
    ],
  },
  {
    id: 10,
    nome: "Equipamento J",
    id_usuario: 110,
    cliente_nome: "Cliente 10",
    cliente: [
      {
        id: 110,
        nome: "Cliente 10",
        email: "cliente10@example.com",
        senha: "senha10",
        username: "cliente10",
      },
    ],
  },
];

export default equipamentosMockData;
