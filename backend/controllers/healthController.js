const getHealth = async (req, res) => {
  res.status(200).json({ message: "Health check passed!" });
};


module.exports = {
  getHealth
};
