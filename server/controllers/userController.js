import UserService from "../services/userService.js";

class UserController {
  static async loginUser(req, res) {
    try {
      const { email, password } = req.body;
      const user = await UserService.loginUser(email, password);

      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      return res.status(200).json(user);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  static async registerUser(req, res) {
    try {
      const userId = await UserService.createUser(req.body);

      if (userId) {
        return res.status(201).json(userId);
      } else {
        return res
          .status(409)
          .json({ message: "User with this email already exists" });
      }
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  static async getUserProfile(req, res) {
    try {
      const user = await UserService.getUserProfile(req.params.id);
      return res.status(200).json(user);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  static async updateUserProfile(req, res) {
    try {
      const success = await UserService.updateUserProfile(
        req.params.id,
        req.body
      );

      if (success) {
        return res
          .status(200)
          .json({ message: "Profile updated successfully" });
      } else {
        return res.status(404).json({ message: "User not found" });
      }
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  static async updatePassword(req, res) {
    try {
      const success = await UserService.updatePassword(
        req.params.id,
        req.body.newPassword
      );

      if (success) {
        return res
          .status(200)
          .json({ message: "Password updated successfully" });
      } else {
        return res.status(404).json({ message: "User not found" });
      }
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  static async getUserTickets(req, res) {
    try {
      const tickets = await UserService.getUserTickets(req.params.userId);
      return res.status(200).json(tickets);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  static async getUserRsvps(req, res) {
    try {
      const rsvps = await UserService.getUserRsvps(req.params.userId);
      return res.status(200).json(rsvps);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  static async getUserPayments(req, res) {
    try {
      const payments = await UserService.getUserPayments(req.params.userId);
      return res.status(200).json(payments);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  static async getUserRefunds(req, res) {
    try {
      const refunds = await UserService.getUserRefunds(req.params.userId);
      return res.status(200).json(refunds);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
}

export default UserController;
