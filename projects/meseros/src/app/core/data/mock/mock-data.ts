import { Categoria, Mesa, Mesero, Producto } from '@shared';

export const MOCK_MESEROS: (Mesero & { pin: string })[] = [
  { id: 'm1', nombre: 'Carlos', avatarColor: '#E65100', pin: '1234' },
  { id: 'm2', nombre: 'Luisa', avatarColor: '#AD1457', pin: '1234' },
  { id: 'm3', nombre: 'Andrés', avatarColor: '#1565C0', pin: '1234' }
];

export const MOCK_MESAS_INICIALES: Mesa[] = [
  // 4 Mesas para Carlos (m1)
  { id: 'mesa-1', numero: 1, zona: 'Salón', capacidad: 4, estado: 'LIBRE', meseroId: 'm1', pedidoActivoId: null, abiertaDesde: null },
  { id: 'mesa-2', numero: 2, zona: 'Salón', capacidad: 2, estado: 'OCUPADA', meseroId: 'm1', pedidoActivoId: 'ped-2', abiertaDesde: new Date(Date.now() - 45 * 60000).toISOString() },
  { id: 'mesa-3', numero: 3, zona: 'Terraza', capacidad: 6, estado: 'ESPERANDO_COMIDA', meseroId: 'm1', pedidoActivoId: 'ped-3', abiertaDesde: new Date(Date.now() - 25 * 60000).toISOString() },
  { id: 'mesa-4', numero: 4, zona: 'Barra', capacidad: 2, estado: 'PIDIO_CUENTA', meseroId: 'm1', pedidoActivoId: 'ped-4', abiertaDesde: new Date(Date.now() - 60 * 60000).toISOString() },

  // 4 Mesas para Luisa (m2)
  { id: 'mesa-5', numero: 5, zona: 'Salón', capacidad: 4, estado: 'LIBRE', meseroId: 'm2', pedidoActivoId: null, abiertaDesde: null },
  { id: 'mesa-6', numero: 6, zona: 'Salón', capacidad: 4, estado: 'OCUPADA', meseroId: 'm2', pedidoActivoId: 'ped-6', abiertaDesde: new Date(Date.now() - 30 * 60000).toISOString() },
  { id: 'mesa-7', numero: 7, zona: 'Terraza', capacidad: 8, estado: 'ESPERANDO_COMIDA', meseroId: 'm2', pedidoActivoId: 'ped-7', abiertaDesde: new Date(Date.now() - 15 * 60000).toISOString() },
  { id: 'mesa-8', numero: 8, zona: 'Barra', capacidad: 2, estado: 'PIDIO_CUENTA', meseroId: 'm2', pedidoActivoId: 'ped-8', abiertaDesde: new Date(Date.now() - 50 * 60000).toISOString() },

  // 4 Mesas para Andrés (m3)
  { id: 'mesa-9', numero: 9, zona: 'Salón', capacidad: 6, estado: 'LIBRE', meseroId: 'm3', pedidoActivoId: null, abiertaDesde: null },
  { id: 'mesa-10', numero: 10, zona: 'Terraza', capacidad: 4, estado: 'OCUPADA', meseroId: 'm3', pedidoActivoId: 'ped-10', abiertaDesde: new Date(Date.now() - 20 * 60000).toISOString() },
  { id: 'mesa-11', numero: 11, zona: 'Terraza', capacidad: 4, estado: 'ESPERANDO_COMIDA', meseroId: 'm3', pedidoActivoId: 'ped-11', abiertaDesde: new Date(Date.now() - 35 * 60000).toISOString() },
  { id: 'mesa-12', numero: 12, zona: 'Barra', capacidad: 2, estado: 'LIBRE', meseroId: 'm3', pedidoActivoId: null, abiertaDesde: null }
];

export const MOCK_CATEGORIAS: Categoria[] = [
  { id: 'cat-1', nombre: 'Entradas', orden: 1 },
  { id: 'cat-2', nombre: 'Carnes a la Llanera', orden: 2 },
  { id: 'cat-3', nombre: 'Platos Típicos', orden: 3 },
  { id: 'cat-4', nombre: 'Acompañamientos', orden: 4 },
  { id: 'cat-5', nombre: 'Bebidas', orden: 5 },
  { id: 'cat-6', nombre: 'Postres', orden: 6 }
];

export const MOCK_PRODUCTOS: Producto[] = [
  // Entradas
  { id: 'prod-1', categoriaId: 'cat-1', nombre: 'Empanadas de Carne (x3)', descripcion: 'Empanadas crocantes rellenas de carne desmechada con ají criollo', precio: 14000, disponible: true, impuesto: 'INC_8' },
  { id: 'prod-2', categoriaId: 'cat-1', nombre: 'Arepa con Queso de Mano', descripcion: 'Arepa de choclo asada al carbón con abundante queso campesino', precio: 12000, disponible: true, impuesto: 'INC_8' },
  { id: 'prod-3', categoriaId: 'cat-1', nombre: 'Chorizo Santarrosano', descripcion: 'Chorizo artesanal asado a la brasa con arepa y limón', precio: 16000, disponible: true, impuesto: 'INC_8' },
  { id: 'prod-4', categoriaId: 'cat-1', nombre: 'Patacones con Hogao', descripcion: 'Porción de 4 patacones crocantes con hogao tradicional llanero', precio: 11000, disponible: true, impuesto: 'INC_8' },

  // Carnes a la Llanera
  { id: 'prod-5', categoriaId: 'cat-2', nombre: 'Mamona Llanera Tradicional (500g)', descripcion: 'Corte insigne de ternera tierna asada lentamente en vara al calor de la brasa', precio: 48000, disponible: true, impuesto: 'INC_8' },
  { id: 'prod-6', categoriaId: 'cat-2', nombre: 'Ternera a la Llanera Especial', descripcion: 'Corte magro con piel tostada, incluye yuca al vapor y papa salada', precio: 45000, disponible: true, impuesto: 'INC_8' },
  { id: 'prod-7', categoriaId: 'cat-2', nombre: 'Punta de Anca al Carbón (400g)', descripcion: 'Corte seleccionado madurado y sellado a la brasa con chimichurri casero', precio: 52000, disponible: true, impuesto: 'INC_8' },
  { id: 'prod-8', categoriaId: 'cat-2', nombre: 'Churrasco Criollo (400g)', descripcion: 'Churrasco marinado en finas hierbas y asado en leña de guayabo', precio: 49000, disponible: true, impuesto: 'INC_8' },
  { id: 'prod-9', categoriaId: 'cat-2', nombre: 'Costillas de Cerdo BBQ Criollo', descripcion: 'Costillas tiernas bañadas en reducción de panela y maracuyá', precio: 44000, disponible: false, impuesto: 'INC_8' }, // NO DISPONIBLE 1

  // Platos Típicos
  { id: 'prod-10', categoriaId: 'cat-3', nombre: 'Pechuga a la Plancha al Romero', descripcion: 'Pechuga campesina marinada al carbón con ensalada fresca', precio: 32000, disponible: true, impuesto: 'INC_8' },
  { id: 'prod-11', categoriaId: 'cat-3', nombre: 'Trucha Frita o al Ajillo', descripcion: 'Trucha arcoíris fresca con patacón llanero y arroz blanco', precio: 38000, disponible: true, impuesto: 'INC_8' },
  { id: 'prod-12', categoriaId: 'cat-3', nombre: 'Sobrebarriga en Salsa Criolla', descripcion: 'Sobrebarriga desmechable con hogao campesino y aguacate', precio: 36000, disponible: true, impuesto: 'INC_8' },
  { id: 'prod-13', categoriaId: 'cat-3', nombre: 'Sancocho Criollo de Gallina', descripcion: 'Sancocho tradicional de leña (Solo fines de semana)', precio: 30000, disponible: false, impuesto: 'INC_8' }, // NO DISPONIBLE 2

  // Acompañamientos
  { id: 'prod-14', categoriaId: 'cat-4', nombre: 'Porción de Yuca al Vapor', descripcion: 'Yuca frita o al vapor bañada en ají suave de la casa', precio: 6000, disponible: true, impuesto: 'INC_8' },
  { id: 'prod-15', categoriaId: 'cat-4', nombre: 'Papa Salada con Hogao', descripcion: 'Papas campesinas cocidas con sal gruesa y hogao caliente', precio: 6000, disponible: true, impuesto: 'INC_8' },
  { id: 'prod-16', categoriaId: 'cat-4', nombre: 'Ensalada Fresca de la Casa', descripcion: 'Lechugas mixtas, tomate chonto, maíz dulce y vinagreta cítrica', precio: 8000, disponible: true, impuesto: 'INC_8' },
  { id: 'prod-17', categoriaId: 'cat-4', nombre: 'Plátano Maduro con Queso y Bocadillo', descripcion: 'Plátano asado a la brasa con queso campesino derretido y dulce de guayaba', precio: 9500, disponible: true, impuesto: 'INC_8' },

  // Bebidas
  { id: 'prod-18', categoriaId: 'cat-5', nombre: 'Limonada de Panela Frappé', descripcion: 'Agua de panela helada batida con limón mandarino fresco', precio: 7500, disponible: true, impuesto: 'EXCLUIDO' },
  { id: 'prod-19', categoriaId: 'cat-5', nombre: 'Limonada de Coco', descripcion: 'Refrescante crema de coco con jugo de limón natural', precio: 12000, disponible: true, impuesto: 'EXCLUIDO' },
  { id: 'prod-20', categoriaId: 'cat-5', nombre: 'Jugo Natural en Agua (Mango/Maracuyá/Lulo)', descripcion: 'Fruta fresca seleccionada preparada al instante', precio: 8000, disponible: true, impuesto: 'EXCLUIDO' },
  { id: 'prod-21', categoriaId: 'cat-5', nombre: 'Jugo Natural en Leche', descripcion: 'Fruta natural con leche entera campesina', precio: 9500, disponible: true, impuesto: 'EXCLUIDO' },
  { id: 'prod-22', categoriaId: 'cat-5', nombre: 'Gaseosa Postobón / Coca-Cola (400ml)', descripcion: 'Presentación en botella pet bien helada', precio: 6000, disponible: true, impuesto: 'IVA_19' },
  { id: 'prod-23', categoriaId: 'cat-5', nombre: 'Cerveza Club Colombia / Águila', descripcion: 'Cerveza nacional 330ml botella', precio: 8500, disponible: true, impuesto: 'IVA_19' },

  // Postres
  { id: 'prod-24', categoriaId: 'cat-6', nombre: 'Cuajada con Melado de Panela', descripcion: 'Cuajada fresca del llano con melado espeso de panela aromatizado con canela', precio: 9000, disponible: true, impuesto: 'INC_8' },
  { id: 'prod-25', categoriaId: 'cat-6', nombre: 'Arequipe con Brevas', descripcion: 'Brevas caladas con arequipe artesanal y queso campesino', precio: 10000, disponible: true, impuesto: 'INC_8' }
];
