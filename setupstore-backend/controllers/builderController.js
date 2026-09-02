import Product from "../models/Product.js";
import Build from "../models/Build.js";

// Controller to check hardware compatibility between PC components (CPU socket, RAM type, and PSU wattage)
const checkCompatibility = async (req, res) => {
  const { cpuId, motherboardId, ramId, psuId } = req.body;

  const productIds = {
    cpu: cpuId,
    motherboard: motherboardId,
    ram: ramId,
    psu: psuId,
  };

  const products = {};

  // Fetch all provided product IDs from the database
  for (const key in productIds) {
    if (productIds[key]) {
      products[key] = await Product.findById(productIds[key]);

      if (!products[key]) {
        return res.status(404).json({ message: `${key} product not found` });
      }
    }
  }

  const checks = [];

  // Check if CPU socket matches the Motherboard socket
  if (products.cpu && products.motherboard) {
    const cpuSocket = products.cpu.specs?.socket;
    const motherboardSocket = products.motherboard.specs?.socket;

    if (cpuSocket && motherboardSocket) {
      const match = cpuSocket === motherboardSocket;
      checks.push({
        pair: "CPU & Motherboard",
        compatible: match,
        reason: match
          ? "Sockets match"
          : `CPU socket (${cpuSocket}) does not match Motherboard socket (${motherboardSocket})`,
      });
    }
  }

  // Check if RAM type matches the Motherboard supported memory type
  if (products.ram && products.motherboard) {
    const ramType = products.ram.specs?.type;
    const motherboardRamType = products.motherboard.specs?.ramType;

    if (ramType && motherboardRamType) {
      const match = ramType === motherboardRamType;
      checks.push({
        pair: "RAM & Motherboard",
        compatible: match,
        reason: match
          ? "Memory types match"
          : `RAM type (${ramType}) does not match Motherboard supported type (${motherboardRamType})`,
      });
    }
  }

  // Check if the Power Supply (PSU) wattage is sufficient for the total system power draw
  if (products.psu) {
    const psuWattage = parseInt(products.psu.specs?.wattage);

    if (psuWattage && !isNaN(psuWattage)) {
      const componentsWithPower = [
        products.cpu,
        products.motherboard,
        products.ram,
      ].filter(Boolean);

      const totalPowerDraw = componentsWithPower.reduce(
        (sum, item) => sum + (parseInt(item.specs?.powerDraw) || 0),
        0,
      );

      const isSufficient = psuWattage >= totalPowerDraw;

      checks.push({
        pair: "PSU Power",
        compatible: isSufficient,
        reason: isSufficient
          ? `PSU (${psuWattage}W) is sufficient for estimated draw (${totalPowerDraw}W)`
          : `PSU (${psuWattage}W) is insufficient for estimated draw (${totalPowerDraw}W)`,
      });
    }
  }

  const overallCompatible = checks.every((check) => check.compatible);

  res.status(200).json({
    overallCompatible,
    checks,
  });
};

// Controller to create a custom PC build for the authenticated user
const createBuild = async (req, res) => {
  const { name, components } = req.body;

  if (!name || !components) {
    return res
      .status(400)
      .json({ message: "Please provide a name and components" });
  }
  // Extract all valid component IDs from the components object, filtering out falsy values/empty selections
  const componentIds = Object.values(components).filter(Boolean);
  const products = await Product.find({ _id: { $in: componentIds } });
  const totalPrice = products.reduce((sum, p) => sum + p.price, 0);

  const build = await Build.create({
    user: req.user._id,
    name,
    components,
    totalPrice,
  });

  res.status(201).json(build);
};

// Controller to fetch all PC builds created by the authenticated user, populating all specific hardware component fields
const getBuilds = async (req, res) => {
  const builds = await Build.find({ user: req.user._id }).populate(
    "components.cpu components.motherboard components.ram components.gpu components.psu components.storage components.case",
  );

  res.status(200).json(builds);
};

// Controller to delete a specific PC build by its ID for the authenticated user, ensuring it belongs to them
const deleteBuild = async (req, res) => {
  const build = await Build.findOneAndDelete({
    _id: req.params.id,
    user: req.user._id,
  });

  if (!build) {
    return res.status(404).json({ message: "Build not found" });
  }

  res.status(200).json({ message: "Build deleted successfully" });
};

export default { checkCompatibility, createBuild, getBuilds, deleteBuild };
