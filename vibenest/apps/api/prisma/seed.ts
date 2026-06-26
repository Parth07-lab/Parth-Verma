import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding VibeNest database...');

  // Clean database
  await prisma.auditLog.deleteMany();
  await prisma.session.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.wishlist.deleteMany();
  await prisma.review.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.address.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.admin.deleteMany();
  await prisma.user.deleteMany();
  await prisma.coupon.deleteMany();

  // Create Users & Admins
  const passwordHash = bcrypt.hashSync('vibenest123', 10);
  
  const customer = await prisma.user.create({
    data: {
      name: 'Rajan Kumar',
      email: 'customer@vibenest.com',
      phone: '+919876543210',
      passwordHash: passwordHash,
      emailVerified: true,
      provider: 'local',
    }
  });

  await prisma.address.create({
    data: {
      userId: customer.id,
      line1: 'Flat 405, Block B, Premium Heights',
      line2: 'Sector 62',
      city: 'Noida',
      state: 'Uttar Pradesh',
      pincode: '201301',
      isDefault: true,
    }
  });

  const admin = await prisma.admin.create({
    data: {
      email: 'admin@vibenest.com',
      passwordHash: passwordHash,
      role: 'super_admin',
      mfaSecret: 'JBSWY3DPEHPK3PXP', // TOTP key stub 'vibenestsecret'
    }
  });

  console.log('Seeded User & Admin.');

  // Create Categories
  const catMen = await prisma.category.create({ data: { name: "Men's Clothing", slug: 'men-clothing' } });
  const catWomen = await prisma.category.create({ data: { name: "Women's Clothing", slug: 'women-clothing' } });
  const catFootwear = await prisma.category.create({ data: { name: 'Footwear', slug: 'footwear' } });
  const catAccessories = await prisma.category.create({ data: { name: 'Accessories', slug: 'accessories' } });

  console.log('Seeded Categories.');

  // Products definitions
  const productsData = [
    // --- MEN'S CLOTHING (9 products) ---
    {
      name: 'Oversized Matte Black Hoodie',
      slug: 'oversized-matte-black-hoodie',
      sku: 'VN-M-001',
      description: 'Premium heavyweight French terry cotton hoodie in a relaxed oversized fit. Double-lined hood, ribbed cuffs, and minimal aesthetic branding.',
      material: '100% Organic Cotton',
      price: 3499,
      discountPct: 15,
      categoryId: catMen.id,
      colors: [{ name: 'Matte Black', hex: '#0D0D0D' }, { name: 'Slate Grey', hex: '#708090' }],
      sizes: ['S', 'M', 'L', 'XL'],
      images: [
        'https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=600',
        'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=600',
        'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=600'
      ],
      reviews: [
        { rating: 5, body: 'Extremely comfortable and heavyweight feel. Truly premium.' },
        { rating: 4, body: 'Great fit, is quite oversized so size down if you want standard fit.' },
        { rating: 5, body: 'Perfect minimal look. I wear this almost every day.' }
      ]
    },
    {
      name: 'Premium Slim-Fit Linen Shirt',
      slug: 'premium-slim-fit-linen-shirt',
      sku: 'VN-M-002',
      description: 'Breathable structured linen shirt perfect for smart-casual wear. Garment-dyed for a soft, worn-in texture and tailored slim fit.',
      material: '100% European Linen',
      price: 2499,
      discountPct: 10,
      categoryId: catMen.id,
      colors: [{ name: 'Pure White', hex: '#FFFFFF' }, { name: 'Olive Green', hex: '#556B2F' }],
      sizes: ['M', 'L', 'XL'],
      images: [
        'https://images.unsplash.com/photo-1603252109303-2751441dd157?q=80&w=600',
        'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=600',
        'https://images.unsplash.com/photo-1621072156002-e2fcc103e86e?q=80&w=600'
      ],
      reviews: [
        { rating: 5, body: 'Top tier quality fabric. Perfect for summers.' },
        { rating: 4, body: 'Very airy and soft. Fits great on shoulders.' }
      ]
    },
    {
      name: 'Urban Cargo Pants',
      slug: 'urban-cargo-pants',
      sku: 'VN-M-003',
      description: 'Rugged ripstop utility cargo pants. Features multi-pocket setup, articulated knees, and drawstrings at cuffs for adjustable styling.',
      material: 'Cotton Polyester Ripstop',
      price: 3999,
      discountPct: 20,
      categoryId: catMen.id,
      colors: [{ name: 'Military Olive', hex: '#3B4D3B' }, { name: 'Dark Navy', hex: '#0B1D33' }],
      sizes: ['30', '32', '34', '36'],
      images: [
        'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?q=80&w=600',
        'https://images.unsplash.com/photo-1517462964-21fdcec3f25b?q=80&w=600',
        'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=600'
      ],
      reviews: [
        { rating: 4, body: 'Very durable and has lots of deep pockets. Fits perfectly.' },
        { rating: 5, body: 'Stitching is very robust. High premium feel.' }
      ]
    },
    {
      name: 'Graphic Streetwear Tee',
      slug: 'graphic-streetwear-tee',
      sku: 'VN-M-004',
      description: 'Heavyweight organic cotton jersey tee featuring a custom high-density puff print graphic at the back. Relaxed fit.',
      material: '100% Organic Cotton (240 GSM)',
      price: 1899,
      discountPct: 10,
      categoryId: catMen.id,
      colors: [{ name: 'Off-White', hex: '#FAF9F6' }, { name: 'Acid Black', hex: '#232323' }],
      sizes: ['S', 'M', 'L', 'XL'],
      images: [
        'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=600',
        'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=600',
        'https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=600'
      ],
      reviews: [
        { rating: 5, body: 'The print has amazing texture, doesnt fade after wash.' },
        { rating: 5, body: 'Best graphic tee I own. Thick fabric.' }
      ]
    },
    {
      name: 'Sherpa-Lined Denim Jacket',
      slug: 'sherpa-lined-denim-jacket',
      sku: 'VN-M-005',
      description: 'Classic distressed denim jacket lined with ultra-soft faux sherpa fleece. Features antique copper buttons and dual chest pockets.',
      material: '100% Cotton Denim / Polyester Fleece',
      price: 5999,
      discountPct: 25,
      categoryId: catMen.id,
      colors: [{ name: 'Light Wash Denim', hex: '#A8C3D8' }, { name: 'Deep Indigo', hex: '#1C3144' }],
      sizes: ['M', 'L', 'XL'],
      images: [
        'https://images.unsplash.com/photo-1611312449412-6cefac5dc3e4?q=80&w=600',
        'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?q=80&w=600',
        'https://images.unsplash.com/photo-1616150638538-ffb0679a3fc4?q=80&w=600'
      ],
      reviews: [
        { rating: 5, body: 'Extremely warm and stylish. Best purchase for winters!' }
      ]
    },
    {
      name: 'Premium Wool Blend Blazer',
      slug: 'premium-wool-blend-blazer',
      sku: 'VN-M-006',
      description: 'Exquisite wool-blend unstructured blazer, double vented with notch lapels. Ideal for contemporary layering.',
      material: '70% Wool, 30% Polyester',
      price: 8999,
      discountPct: 15,
      categoryId: catMen.id,
      colors: [{ name: 'Charcoal Herringbone', hex: '#3E3E3E' }],
      sizes: ['40', '42', '44'],
      images: [
        'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=600',
        'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=600',
        'https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?q=80&w=600'
      ],
      reviews: [
        { rating: 5, body: 'Fits like a bespoke suit. Fabric has a great drape.' }
      ]
    },
    {
      name: 'Essential French Terry Sweatpants',
      slug: 'essential-french-terry-sweatpants',
      sku: 'VN-M-007',
      description: 'Tapered lounge joggers in soft loopback cotton. Concealed zipper pockets and metallic tipped drawcords.',
      material: '100% French Terry Cotton',
      price: 2299,
      discountPct: 15,
      categoryId: catMen.id,
      colors: [{ name: 'Heather Grey', hex: '#D3D3D3' }, { name: 'Matte Black', hex: '#0D0D0D' }],
      sizes: ['S', 'M', 'L', 'XL'],
      images: [
        'https://images.unsplash.com/photo-1551854838-212c50b4c184?q=80&w=600',
        'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=600',
        'https://images.unsplash.com/photo-1511706853245-0d3a5160d5b2?q=80&w=600'
      ],
      reviews: [
        { rating: 4, body: 'Soft interior, zipper pockets are super handy.' }
      ]
    },
    {
      name: 'Minimalist Knit Polo',
      slug: 'minimalist-knit-polo',
      sku: 'VN-M-008',
      description: 'Fine-gauge knit polo shirt. Elegant open collar design with ribbed hem and cuffs for a modern retro silhouette.',
      material: '100% Mercerized Cotton',
      price: 2999,
      discountPct: 10,
      categoryId: catMen.id,
      colors: [{ name: 'Warm Beige', hex: '#D2B48C' }, { name: 'Navy Blue', hex: '#000080' }],
      sizes: ['M', 'L', 'XL'],
      images: [
        'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?q=80&w=600',
        'https://images.unsplash.com/photo-1581655353564-df123a1eb820?q=80&w=600',
        'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?q=80&w=600'
      ],
      reviews: [
        { rating: 5, body: 'Extremely soft fabric, sits beautifully.' }
      ]
    },
    
    // --- WOMEN'S CLOTHING (7 products) ---
    {
      name: 'Satin Silk Wrap Dress',
      slug: 'satin-silk-wrap-dress',
      sku: 'VN-W-001',
      description: 'A luxurious fluid wrap dress made of premium high-shine satin. Self-tie belt and subtle puff sleeves make it elegant for evening wear.',
      material: 'Luxury Silk Satin Poly',
      price: 5499,
      discountPct: 20,
      categoryId: catWomen.id,
      colors: [{ name: 'Champagne Gold', hex: '#E8D8B6' }, { name: 'Emerald Green', hex: '#046307' }],
      sizes: ['XS', 'S', 'M', 'L'],
      images: [
        'https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=600',
        'https://images.unsplash.com/photo-1566174053879-31528523f8ae?q=80&w=600',
        'https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=600'
      ],
      reviews: [
        { rating: 5, body: 'Fits like a dream. Beautiful drape and sheen.' },
        { rating: 4.8, body: 'Wore it to a wedding reception, got countless compliments.' }
      ]
    },
    {
      name: 'Cropped Puffer Jacket',
      slug: 'cropped-puffer-jacket',
      sku: 'VN-W-002',
      description: 'Water-resistant quilted puffer jacket with recycled down insulation. High stand collar and adjustable hem drawcord.',
      material: 'Nylon Shell with Recycled Down',
      price: 6999,
      discountPct: 30,
      categoryId: catWomen.id,
      colors: [{ name: 'Matte Cream', hex: '#F5F5DC' }, { name: 'Midnight Black', hex: '#0D0D0D' }],
      sizes: ['S', 'M', 'L'],
      images: [
        'https://images.unsplash.com/photo-1544022613-e87ca75a784a?q=80&w=600',
        'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=600',
        'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=600'
      ],
      reviews: [
        { rating: 4, body: 'Super warm, is cropped but covers just enough.' },
        { rating: 5, body: 'Perfect winter staple jacket.' }
      ]
    },
    {
      name: 'High-Waist Wide-Leg Joggers',
      slug: 'high-waist-wide-leg-joggers',
      sku: 'VN-W-003',
      description: 'Premium heavyweight joggers with a flattering high-rise waistband and elegant wide-leg fit. Perfect smart leisure wear.',
      material: 'Organic Cotton French Terry',
      price: 2499,
      discountPct: 15,
      categoryId: catWomen.id,
      colors: [{ name: 'Oatmeal Melange', hex: '#EAE6DF' }, { name: 'Sage Green', hex: '#B2AC88' }],
      sizes: ['XS', 'S', 'M', 'L'],
      images: [
        'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=600',
        'https://images.unsplash.com/photo-1620799139834-6b8f844fbe61?q=80&w=600',
        'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=600'
      ],
      reviews: [
        { rating: 5, body: 'The wide leg structure is super chic and feels incredibly soft.' }
      ]
    },
    {
      name: 'Oversized Linen Shirt Dress',
      slug: 'oversized-linen-shirt-dress',
      sku: 'VN-W-004',
      description: 'Effortless relaxed shirt dress in high grade linen. Featuring drop shoulders, button-through front, and side slits.',
      material: '100% Pure Flax Linen',
      price: 3299,
      discountPct: 10,
      categoryId: catWomen.id,
      colors: [{ name: 'Natural Sand', hex: '#C2B280' }, { name: 'Soft Blue', hex: '#ADD8E6' }],
      sizes: ['S', 'M', 'L'],
      images: [
        'https://images.unsplash.com/photo-1596783074918-c84cb06531ca?q=80&w=600',
        'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?q=80&w=600',
        'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=600'
      ],
      reviews: [
        { rating: 5, body: 'Wonderful beach cover up or casual day dress.' }
      ]
    },
    {
      name: 'Ribbed Knit Midi Skirt',
      slug: 'ribbed-knit-midi-skirt',
      sku: 'VN-W-005',
      description: 'Form-fitting midi skirt in dynamic ribbed knit. Features elastic waistband and side leg slit.',
      material: 'Viscose Nylon Elastic Blend',
      price: 2799,
      discountPct: 15,
      categoryId: catWomen.id,
      colors: [{ name: 'Cacao Brown', hex: '#5C4033' }, { name: 'Pure Onyx', hex: '#0D0D0D' }],
      sizes: ['XS', 'S', 'M', 'L'],
      images: [
        'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=600',
        'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?q=80&w=600',
        'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=600'
      ],
      reviews: [
        { rating: 5, body: 'Stretches nicely and holds shape well. Highly recommend.' }
      ]
    },
    {
      name: 'Tailored Wide-Leg Trousers',
      slug: 'tailored-wide-leg-trousers',
      sku: 'VN-W-006',
      description: 'Sophisticated pleated trousers with high waist, side pockets, and pressed creases.',
      material: 'Recycled Polyester Viscose',
      price: 3999,
      discountPct: 15,
      categoryId: catWomen.id,
      colors: [{ name: 'Desert Taupe', hex: '#B38B6D' }, { name: 'Matte Black', hex: '#0D0D0D' }],
      sizes: ['26', '28', '30', '32'],
      images: [
        'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?q=80&w=600',
        'https://images.unsplash.com/photo-1509551388413-e18d0ac5d495?q=80&w=600',
        'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?q=80&w=600'
      ],
      reviews: [
        { rating: 5, body: 'Perfect work trousers, very sleek styling.' }
      ]
    },
    {
      name: 'Minimalist Trench Coat',
      slug: 'minimalist-trench-coat',
      sku: 'VN-W-007',
      description: 'Double-breasted timeless trench coat featuring adjustable belt, storm flaps, and premium horn buttons.',
      material: 'Cotton Gabardine',
      price: 9999,
      discountPct: 20,
      categoryId: catWomen.id,
      colors: [{ name: 'Classic Camel', hex: '#C19A6B' }],
      sizes: ['S', 'M', 'L'],
      images: [
        'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=600',
        'https://images.unsplash.com/photo-1548883354-7622d03aca27?q=80&w=600',
        'https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?q=80&w=600'
      ],
      reviews: [
        { rating: 5, body: 'A classic investment piece. Water resistant and looks super expensive.' }
      ]
    },
    
    // --- FOOTWEAR (6 products) ---
    {
      name: 'VibeNest Air Runners',
      slug: 'vibenest-air-runners',
      sku: 'VN-F-001',
      description: 'High-performance athletic sneakers designed with breathable flyknit mesh, responsive nitro-foam midsole, and carbon plate propulsion.',
      material: 'Recycled Flyknit / TPU / Nitro Foam',
      price: 8499,
      discountPct: 10,
      categoryId: catFootwear.id,
      colors: [{ name: 'Neon Volt', hex: '#CCFF00' }, { name: 'Triple White', hex: '#FFFFFF' }],
      sizes: ['41', '42', '43', '44', '45'],
      images: [
        'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=600',
        'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?q=80&w=600',
        'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?q=80&w=600'
      ],
      reviews: [
        { rating: 5, body: 'Feels like running on clouds. Excellent heel strike rebound.' },
        { rating: 4.5, body: 'Great cushioning, very good for high arch runners.' }
      ]
    },
    {
      name: 'All-Black Chunky Sneakers',
      slug: 'all-black-chunky-sneakers',
      sku: 'VN-F-002',
      description: 'Modern luxury streetwear chunky sneakers. Features multi-layered mesh, suede overlays, and sculptural thick rubber outsole.',
      material: 'Suede, Leather & Breathable Mesh',
      price: 7999,
      discountPct: 15,
      categoryId: catFootwear.id,
      colors: [{ name: 'Triple Black', hex: '#0D0D0D' }],
      sizes: ['40', '41', '42', '43', '44'],
      images: [
        'https://images.unsplash.com/photo-1539185441755-769473a23570?q=80&w=600',
        'https://images.unsplash.com/photo-1556906781-9a412961c28c?q=80&w=600',
        'https://images.unsplash.com/photo-1607522370275-f14206abe5d3?q=80&w=600'
      ],
      reviews: [
        { rating: 4, body: 'Bulky but surprisingly lightweight. Awesome stealth look.' },
        { rating: 5, body: 'Completely obsessed with these!' }
      ]
    },
    {
      name: 'Minimalist Leather Loafers',
      slug: 'minimalist-leather-loafers',
      sku: 'VN-F-003',
      description: 'Crafted from Italian full-grain leather, these loafers offer timeless elegance. Features hand-stitched detailing and comfortable leather footbed.',
      material: 'Full-Grain Calfskin Leather',
      price: 9499,
      discountPct: 20,
      categoryId: catFootwear.id,
      colors: [{ name: 'Bordeaux Burgundy', hex: '#800020' }, { name: 'Classic Black', hex: '#000000' }],
      sizes: ['41', '42', '43', '44'],
      images: [
        'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?q=80&w=600',
        'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=600',
        'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?q=80&w=600'
      ],
      reviews: [
        { rating: 5, body: 'Luxurious finish. Took a few days to break in but now they fit perfectly.' }
      ]
    },
    {
      name: 'Suede Trail Boots',
      slug: 'suede-trail-boots',
      sku: 'VN-F-004',
      description: 'Weatherproof high-top boots made of premium oiled cow suede. Reinforced metal eyelets and rugged Vibram tread sole.',
      material: 'Waterproof Oiled Suede / Rubber',
      price: 11999,
      discountPct: 10,
      categoryId: catFootwear.id,
      colors: [{ name: 'Tan Beige', hex: '#D2B48C' }, { name: 'Chocolate Brown', hex: '#3D2314' }],
      sizes: ['41', '42', '43', '44', '45'],
      images: [
        'https://images.unsplash.com/photo-1520639888713-7851133b1ed0?q=80&w=600',
        'https://images.unsplash.com/photo-1542272604-787c3835535d?q=80&w=600',
        'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?q=80&w=600'
      ],
      reviews: [
        { rating: 5, body: 'Incredibly built. Walked 15km on day one and zero blisters.' }
      ]
    },
    {
      name: 'Retro Court Sneakers',
      slug: 'retro-court-sneakers',
      sku: 'VN-F-005',
      description: 'Clean low-top tennis sneakers with a vintage aesthetic. Perforated toe box and contrast suede heel tab.',
      material: 'Nappa Leather / Gum Sole',
      price: 4999,
      discountPct: 15,
      categoryId: catFootwear.id,
      colors: [{ name: 'Off-White Green', hex: '#FAF9F6' }, { name: 'Off-White Navy', hex: '#EAE6DF' }],
      sizes: ['40', '41', '42', '43', '44'],
      images: [
        'https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=600',
        'https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?q=80&w=600',
        'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=600'
      ],
      reviews: [
        { rating: 5, body: 'Goes with literally any outfit.' }
      ]
    },
    {
      name: 'Double Strap Leather Slides',
      slug: 'double-strap-leather-slides',
      sku: 'VN-F-006',
      description: 'Premium casual summer slides. Double thick leather straps with adjustable metal buckles and molded cork footbed.',
      material: 'Aniline Leather / Cork Sole',
      price: 2999,
      discountPct: 10,
      categoryId: catFootwear.id,
      colors: [{ name: 'Tan Brown', hex: '#A0522D' }, { name: 'Matte Black', hex: '#0D0D0D' }],
      sizes: ['39', '40', '41', '42', '43'],
      images: [
        'https://images.unsplash.com/photo-1603487742131-4160ec999306?q=80&w=600',
        'https://images.unsplash.com/photo-1595341595378-fc20bc324a10?q=80&w=600',
        'https://images.unsplash.com/photo-1560343090-f0409e92791a?q=80&w=600'
      ],
      reviews: [
        { rating: 4, body: 'Super comfortable cork footbed.' }
      ]
    },
    
    // --- ACCESSORIES (4 products) ---
    {
      name: 'Structured Cotton Cap',
      slug: 'structured-cotton-cap',
      sku: 'VN-A-001',
      description: '6-panel structured baseball cap made from heavy-weight cotton twill. Features curved visor and adjustable brass buckle closure.',
      material: '100% Heavy Twill Cotton',
      price: 1499,
      discountPct: 10,
      categoryId: catAccessories.id,
      colors: [{ name: 'Matte Black', hex: '#0D0D0D' }, { name: 'Cream Olive', hex: '#556B2F' }],
      sizes: ['One Size'],
      images: [
        'https://images.unsplash.com/photo-1534215754734-18e55d13e346?q=80&w=600',
        'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?q=80&w=600',
        'https://images.unsplash.com/photo-1576871337622-98d48d4aa53e?q=80&w=600'
      ],
      reviews: [
        { rating: 5, body: 'Best fitting cap I own. Very stiff crown, looks premium.' },
        { rating: 4.8, body: 'Simple, understated, high quality.' }
      ]
    },
    {
      name: 'Waterproof Canvas Tote Bag',
      slug: 'waterproof-canvas-tote-bag',
      sku: 'VN-A-002',
      description: 'Spacious everyday tote bag made of wax-coated heavy duty canvas. Inner laptop sleeve and custom utility metal ring.',
      material: '18oz Waxed Cotton Canvas / Leather Trim',
      price: 3499,
      discountPct: 15,
      categoryId: catAccessories.id,
      colors: [{ name: 'Khaki Sand', hex: '#F0E68C' }, { name: 'Coal Black', hex: '#111111' }],
      sizes: ['One Size'],
      images: [
        'https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=600',
        'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?q=80&w=600',
        'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?q=80&w=600'
      ],
      reviews: [
        { rating: 5, body: 'Extremely durable. Fits my 16 inch MacBook Pro easily with room for charger and books.' }
      ]
    },
    {
      name: 'Stealth Leather Watch',
      slug: 'stealth-leather-watch',
      sku: 'VN-A-003',
      description: 'Minimalist design quartz watch with matte black alloy casing, scratch-resistant sapphire glass, and raw edge black leather strap.',
      material: 'Alloy Case / Sapphire Glass / Horween Leather',
      price: 6499,
      discountPct: 12,
      categoryId: catAccessories.id,
      colors: [{ name: 'Midnight Black', hex: '#0D0D0D' }],
      sizes: ['One Size'],
      images: [
        'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?q=80&w=600',
        'https://images.unsplash.com/photo-1612817288484-6f916006741a?q=80&w=600',
        'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?q=80&w=600'
      ],
      reviews: [
        { rating: 4.9, body: 'Incredible minimal style, keeps accurate time. Beautiful packaging too.' }
      ]
    },
    {
      name: 'Slim Card Holder Wallet',
      slug: 'slim-card-holder-wallet',
      sku: 'VN-A-004',
      description: 'Ultra-thin card sleeve containing 4 slots and a center cash pocket. Constructed with hand-stitched vegetable tanned leather.',
      material: 'Vegetable Tanned Leather',
      price: 1999,
      discountPct: 15,
      categoryId: catAccessories.id,
      colors: [{ name: 'Tan Leather', hex: '#D2B48C' }, { name: 'Nero Black', hex: '#000000' }],
      sizes: ['One Size'],
      images: [
        'https://images.unsplash.com/photo-1588444839799-eaa432b87d09?q=80&w=600',
        'https://images.unsplash.com/photo-1590564313993-6e6ca0858882?q=80&w=600',
        'https://images.unsplash.com/photo-1606503829035-779893d50df5?q=80&w=600'
      ],
      reviews: [
        { rating: 5, body: 'Tiny footprint in pocket, fits 6 cards and a few folded bills.' }
      ]
    }
  ];

  for (const prod of productsData) {
    const product = await prisma.product.create({
      data: {
        name: prod.name,
        slug: prod.slug,
        sku: prod.sku,
        description: prod.description,
        material: prod.material,
        price: prod.price,
        discountPct: prod.discountPct,
        categoryId: prod.categoryId,
        stock: prod.colors.length * prod.sizes.length * 10,
      }
    });

    // Create Variants
    for (const color of prod.colors) {
      for (const size of prod.sizes) {
        await prisma.productVariant.create({
          data: {
            productId: product.id,
            color: color.name,
            size: size,
            stock: 10, // default stock per variant
          }
        });
      }
    }

    // Create Images
    for (let i = 0; i < prod.images.length; i++) {
      await prisma.productImage.create({
        data: {
          productId: product.id,
          url: prod.images[i],
          isPrimary: i === 0,
          sortOrder: i,
        }
      });
    }

    // Create Reviews
    for (const rev of prod.reviews) {
      await prisma.review.create({
        data: {
          productId: product.id,
          userId: customer.id,
          rating: rev.rating,
          body: rev.body,
          isVerified: true,
        }
      });
    }
  }

  // Create some initial coupons
  await prisma.coupon.createMany({
    data: [
      {
        code: 'VIBESTART',
        discountType: 'percentage',
        value: 10,
        minOrderValue: 2000,
        usageLimit: 100,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      },
      {
        code: 'NESTMBA',
        discountType: 'fixed',
        value: 500,
        minOrderValue: 4000,
        usageLimit: 50,
        expiresAt: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 days
      }
    ]
  });

  console.log('VibeNest Database successfully seeded with 25 premium fashion catalog products.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
