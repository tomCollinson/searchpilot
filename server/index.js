const z = require("zod");
const cors = require("cors");

const express = require("express");

const PORT = process.env.PORT || 8080;

const app = express();

app.use(express.json());

const footwearSizes = z.enum(["US 7", "US 8", "US 9", "US 10"]);
const clothingSizes = z.enum(["XS", "S", "M", "L", "XL"]);

const productSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("footwear"),
    name: z.string(),
    sizes: z.array(footwearSizes),
    features: z.array(z.string()),
    brand: z.string(),
    style: z.string(),
  }),
  z.object({
    type: z.literal("activewear"),
    name: z.string(),
    sizes: z.array(clothingSizes),
    features: z.array(z.string()),
    brand: z.string(),
  }),
  z.object({
    type: z.literal("outerwear"),
    name: z.string(),
    sizes: z.array(clothingSizes),
    features: z.array(z.string()),
    brand: z.string(),
    materials: z.string(),
  }),
  z.object({
    type: z.literal("dress"),
    name: z.string(),
    sizes: z.array(clothingSizes),
    features: z.array(z.string()),
    brand: z.string(),
    colour: z.string(),
  }),
  z.object({
    type: z.literal("top"),
    name: z.string(),
    sizes: z.array(clothingSizes),
    features: z.array(z.string()),
    brand: z.string(),
    neckline: z.string(),
  }),
]);

const productNameSchema = z.object({
  name: z.string(),
  id: z.number().int().optional(),
})


const newProductSchema = productSchema.refine(
  (data) => !products.find((product) => product.name === data.name),
  { message: "Name must be unique", path: ["name"] }
);

const existingProductSchema = z
  .intersection(
    productSchema,
    z.object({
      id: z.number().int(),
    })
  )
  .refine(
    (data) =>
      !products
        .filter((product) => product.id !== data.id)
        .find((product) => product.name === data.name),
    { message: "Name must be unique", path: ["name"] }
  );


const existingProductNameSchema = productNameSchema
.refine(
  (data) => 
    !products
      .filter((product) => product.id !== data.id)
      .find((product) => product.name === data.name)
  ,
  { message: "Name must be unique", path: ["name"] }
); 
  
const getProducts = () => {
  return {
    products: [
      {
        id: 1,
        name: "Velocity Runner Running Shoes",
        type: "footwear",
        sizes: ["US 7", "US 8", "US 9", "US 10"],
        features: [
          "Shock-absorbing sole",
          "Breathable mesh upper",
          "Cushioned insole",
        ],
        brand: "RunXpert",
        style: "Trail running shoes",
      },
      {
        id: 2,
        name: "Urban Stride Casual Sneakers",
        type: "footwear",
        sizes: ["US 6", "US 7", "US 8", "US 9"],
        features: ["Versatile design", "Canvas material", "Rubber sole"],
        brand: "UrbanSteps",
        style: "Slip on canvas",
      },
      {
        id: 3,
        name: "Performance Pro Sports Bra",
        type: "activewear",
        sizes: ["XS", "S", "M"],
        features: [
          "Moisture-wicking fabric",
          "Racerback design",
          "Medium support",
        ],
        brand: "FitFlex",
      },
      {
        id: 4,
        name: "FlexFlow Yoga Leggings",
        type: "activewear",
        sizes: ["S", "M", "L"],
        features: ["Stretchy and comfortable", "High-waisted", "Inner pocket"],
        brand: "YogaEssentials",
      },
      {
        id: 5,
        name: "Arctic Chill Winter Coat",
        type: "outerwear",
        sizes: ["M", "L", "XL"],
        features: [
          "Insulated for warmth",
          "Removable hood",
          "Multiple pockets",
        ],
        brand: "ExtremeGear",
        materials: "Graphene",
      },
      {
        id: 6,
        name: "Rain Shield Jacket",
        type: "outerwear",
        sizes: ["S", "M", "L", "XL"],
        features: ["Waterproof", "Breathable", "Adjustable cuffs"],
        brand: "WeatherProtectors",
        materials: "Coated Nylon",
      },
      {
        id: 7,
        name: "Sunny Day Sundress",
        type: "dress",
        sizes: ["S", "M", "L"],
        features: [
          "Lightweight and airy",
          "Spaghetti straps",
          "Floral pattern",
        ],
        brand: "ChicStyles",
        colour: "Orange",
      },
      {
        id: 8,
        name: "Enchanting Evening Gown",
        type: "dress",
        sizes: ["XS", "S", "M", "L", "XL"],
        features: ["Floor-length", "V-neckline", "Flowing fabric"],
        brand: "Eleganza",
        colour: "Golden yellow",
      },
      {
        id: 9,
        name: "Cool Breeze Tee",
        type: "top",
        sizes: ["S", "M", "L", "XL"],
        features: ["Breathable fabric", "Round neck", "Short sleeves"],
        brand: "Aerowear",
        neckline: "Round neck",
      },
      {
        id: 10,
        name: "Comfy Hoodie",
        type: "top",
        sizes: ["S", "M", "L", "XL"],
        features: ["Warm and cozy", "Kangaroo pocket", "Hood with drawstrings"],
        brand: "OutfitMakers",
        neckline: "Cowl neck",
      },
    ],
  };
};

let { products } = getProducts();

app.use(cors());

// list of products
app.get("/api/products", (req, res) => {
  res.json(products);
  console.log("Sent products data");
});

// get individual product id
app.get("/api/products/:id", (req, res) => {
  const id = Number(req.params.id);
  const product = products.find((product) => product.id === id);
  if (product) {
    res.json(product);
  } else {
    res.status(404).end();
  }
});

const generateId = () => {
  const maxId =
    products.length > 0 ? Math.max(...products.map((n) => n.id)) : 0;
  return maxId + 1;
};

// save for edit and create form
app.post("/api/products", async (req, res) => {
  const body = req.body;

  const result = newProductSchema.safeParse(body);

  if (!result.success) {
    return res.status(400).json({ error: result.error });
  }

  const product = {
    ...body,
    id: generateId(),
  };

  products = products.concat(product);
  res.json(product);
});

app.put("/api/products/:id", async (req, res) => {
  let body = req.body;

  const id = Number(req.params.id);

  body["id"] = id;

  const result = existingProductSchema.safeParse(body);

  if (!result.success) {
    return res.status(400).json({ error: result.error });
  }

  const updatedProduct = {
    ...body,
    id: id,
  };

  const product = products.find((product) => product.id === id);

  if (product) {
    Object.assign(product, updatedProduct);
  } else {
    console.log("Not Found");
    return res.status(404).json({
      error: "product not found",
    });
  }

  res.json(product);
});

// validate unique product name
app.post("/api/validate/:id?", (req, res) => {
  // validate unique product name field
  // throw error when it's not unique
  const body = req.body;
  
  let result
  if(req.params.id) { 
    const id = Number(req.params.id)
    body["id"] = id;
    result = existingProductNameSchema.safeParse(body);
  } else {
    result = existingProductNameSchema.safeParse(body);
  }

  if (!result.success) {
    return res.status(400).json({ error: result.error });
  }

  if(result.success) {
    return res.status(200).json({ message: "Product name is unique."})
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
