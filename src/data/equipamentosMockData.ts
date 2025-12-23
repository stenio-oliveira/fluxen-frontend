import type { Equipamento } from "../types/Equipamento";

const equipamentosMockData: Equipamento[] = [
  {
    id: 1,
    nome: "Equipamento A",
    id_cliente: 101,
    cliente_nome: "Cliente 1",
    cliente: {
      id: 101,
      nome: "Cliente 1",
      cnpj: "12.345.678/0001-01",
    },
  },
  {
    id: 2,
    nome: "Equipamento B",
    id_cliente: 102,
    cliente_nome: "Cliente 2",
    cliente: {
      id: 102,
      nome: "Cliente 2",
      cnpj: "12.345.678/0001-02",
    },
  },
  {
    id: 3,
    nome: "Equipamento C",
    id_cliente: 103,
    cliente_nome: "Cliente 3",
    cliente: {
      id: 103,
      nome: "Cliente 3",
      cnpj: "12.345.678/0001-03",
    },
  },
  {
    id: 4,
    nome: "Equipamento D",
    id_cliente: 104,
    cliente_nome: "Cliente 4",
    cliente: {
      id: 104,
      nome: "Cliente 4",
      cnpj: "12.345.678/0001-04",
    },
  },
  {
    id: 5,
    nome: "Equipamento E",
    id_cliente: 105,
    cliente_nome: "Cliente 5",
    cliente: {
      id: 105,
      nome: "Cliente 5",
      cnpj: "12.345.678/0001-05",
    },
  },
  {
    id: 6,
    nome: "Equipamento F",
    id_cliente: 106,
    cliente_nome: "Cliente 6",
    cliente: {
      id: 106,
      nome: "Cliente 6",
      cnpj: "12.345.678/0001-06",
    },
  },
  {
    id: 7,
    nome: "Equipamento G",
    id_cliente: 107,
    cliente_nome: "Cliente 7",
    cliente: {
      id: 107,
      nome: "Cliente 7",
      cnpj: "12.345.678/0001-07",
    },
  },
  {
    id: 8,
    nome: "Equipamento H",
    id_cliente: 108,
    cliente_nome: "Cliente 8",
    cliente: {
      id: 108,
      nome: "Cliente 8",
      cnpj: "12.345.678/0001-08",
    },
  },
  {
    id: 9,
    nome: "Equipamento I",
    id_cliente: 109,
    cliente_nome: "Cliente 9",
    cliente: {
      id: 109,
      nome: "Cliente 9",
      cnpj: "12.345.678/0001-09",
    },
  },
  {
    id: 10,
    nome: "Equipamento J",
    id_cliente: 110,
    cliente_nome: "Cliente 10",
    cliente: {
      id: 110,
      nome: "Cliente 10",
      cnpj: "12.345.678/0001-10",
    },
  },
];

export default equipamentosMockData;
