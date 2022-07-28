import { z } from "zod";

const incorrectName = 100;
const correctName = "John";

/* FIRST SCHEMA */
// creando un esquema para luego compararlo. En este caso va a ser una validación de string
const stringSchema = z.string();

// comparando una entrada a traves del esquema stringSchema
stringSchema.parse(correctName);
// stringSchema.parse(incorrectName); --> al usar el método parse, este arroja un error que frena la ejecución del programa

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/* DATA TYPES */
// algunos tipos de datos literales en las validaciones
const numberSchema = z.number();
const booleanSchema = z.boolean();
const undefinedSchema = z.undefined();
const nullSchema = z.null();

// otro tipo de dato en las validaciones. En este caso un objeto.
const userSchema = z.object({
  email: z.string().email(),
  fullName: z.string(),
  phone: z.number(),
});

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/* TYPE INFERENCE */
// para contar con el autocompletado, en typescript, lo que hacemos es especificar el tipo de dato de cada propiedad del objeto. Ejemplo:
const userInputTS: { email: string; fullName: string; phone: number } = {
  email: "email@email.com",
  fullName: "fullName",
  phone: 123123123,
};
// para poder contar con el autocompletado de los esquemas de zod podemos hacer lo siguiente:
// con ZOD podemos hacer lo mismo sin escribirlo 2 veces
// creamos el tipo de dato:
type UserType = z.infer<typeof userSchema>;

// entonces ahora podemos hacer lo siguiente:
const userInputZod: UserType /*Especificamos que el tipo de dato es, de hecho, un esquema de ZOD*/ =
  {
    email: "abc@def.xyz",
    fullName: "abc",
    phone: 123,
  };

// validamos el objeto userInputZod con ZOD a traves del esquema userSchema creado anteriormente
const userResult = userSchema.parse(userInputZod);
// mostramos el resultado por consola
console.log(userResult);

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/* COMBINACION DE ESQUEMAS */
// ZOD nos permite combinar esquemas diferentes para poder validarlos luego. Ej:

// reamos un nuevo esquema:
const adressSchema = z.object({
  street: z.string(),
  city: z.string(),
});

// combinamos nuestro esquema creado para formar uno nuevo llamado citizenSchema
const citizenSchema = userSchema.merge(adressSchema);
// este esquema nuevo contiene todas las propiedades de ambos esquemas

// creamos el tipo de dato:
type citizenType = z.infer<typeof citizenSchema>;

// creamos un objeto
const newCitizen: citizenType /*indicamos el tipo de dato (en este caso nuestro esquema combinado de ZOD)*/ =
  {
    city: "London",
    street: "123 fake St.",
    email: "fake@email.com",
    phone: 123456,
    fullName: "fakeFullName",
  };

// validamos el objeto newCitizen con zod a traves de citizenSchema
const citizenResult = citizenSchema.parse(newCitizen);
// mostramos el resultado por consola
console.log(citizenResult);

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/* SAFE PARSE */
// cuando usamos el método parse() éste, al encontrarse con un error, interfiere en la ejecución del programa
// diferente a parse(), safeParse() no frena la ejecución del programa ya que guarda el error de la validación en la variable.

// de esta manera podemos validar la primer variable sin terminar con la ejecución del programa.
const safeStringResult = stringSchema.safeParse(incorrectName);
// muestro el resultado por consola.
console.log(safeStringResult);

// creamos un esquema de ZOD
const zodSchema = z.string();

// valido un tipo de dato diferente al anteriormente especificado
const safeResult = zodSchema.safeParse(
  /* Contrario a lo que debería ir, intentamos validar un número*/ 30
);
// Mostramos el resultado por consola y vemos que la ejecución no frena
console.log(safeResult);
console.log("Ejecución en pie");

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/* ARRAYS VALIDATION */
// al momento de definir los esquemas de los array podemos definirlo de 2 diferentes maneras

// manera 1
const stringArraySchema1 = z.array(z.string());
// manera 2
const stringArraySchema2 = z.string().array();
// manera incorrecta --> z.array().string();

// creamos un tipo de dato:
type stringArrayType = z.infer<typeof stringArraySchema1>;

const stringsArray: stringArrayType /*escribo el tipo de dato*/ = ["1", "2", "3"];

// validamos la variable stringsArray a traves del esquema anteriormente creado;
const arrayResult = stringArraySchema1.safeParse(stringsArray);
// mostramos el resultado por consola
console.log(arrayResult);

// también podemos hacer que sea opcional. Que sea opcional significa que: O bien es undefined o bien es el tipo de dato que especificamos

const schemaTres = z.string().array().optional();
// creamos el tipo de dato
type sTres = z.infer<typeof schemaTres>;

// validamos un dato a traves del esquema anteriormente creado;
const optionalResult = schemaTres.parse([]); // --> tambien podriamos validar schemaTres.parse(undefined) y sería correcto ya que indicamos que es opcional
// mostramos el resultado por consola
console.log(optionalResult);

/* PRECAUCION: El orden de los métodos alteran el resultado */
const schemaCuatro = z.string().optional().array(); // --> en este caso lo opcional sería el tipo de dato dentro del array, siendo string o undefined
