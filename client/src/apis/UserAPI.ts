import ApiResponse from "./ApiResponse";

const userApi = {
  async register(email: string, password: string) {
    const response = await fetch("http://localhost:5000/users/register", {
      method: "POST",
      body: JSON.stringify({ email, password }),
      headers: {
        "Content-Type": "application/json"
      }
    });
    if (response.status > 300)
      return new ApiResponse(response.status, await response.text());

    return new ApiResponse(
      response.status,
      `Successfuly registered user ${email}`
    );
  },

  async login(email: string, password: string) {
    const response = await fetch("http://localhost:5000/users/login", {
      method: "POST",
      body: JSON.stringify({
        email,
        password
      }),
      headers: {
        "Content-Type": "application/json"
      }
    });

    if (response.status > 300)
      return new ApiResponse(response.status, await response.text());

    const token = await response.text();

    if (!token) return new ApiResponse(500, "Something went wrong");

    localStorage.setItem("jwt", token);

    return new ApiResponse(response.status, "");
  }
};

export default userApi;
