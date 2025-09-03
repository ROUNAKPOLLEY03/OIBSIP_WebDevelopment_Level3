export const getUser = async (req, res) => {
  const { user } = req;
  console.log(user);
  if (!user)
    res.status(201).json({
      status: "Failed",
    });

  res.status(201).json({
    status: "success",
    data: { user: user },
  });
};
