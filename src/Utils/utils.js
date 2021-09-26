class scan {
  static obj = (obj, name) => {
    return !obj.hasOwnProperty(name) ||
      typeof obj[name] !== "object" ||
      Array.isArray(obj[name])
      ? false
      : true;
  };

  static obj_optional = (obj, name) => {
    if (!obj.hasOwnProperty(name)) return true;
    return typeof obj[name] !== "object" || Array.isArray(obj[name])
      ? false
      : true;
  };

  static aObj = (obj) => {
    return typeof obj !== "object" || Array.isArray(obj) ? false : true;
  };

  static array = (arr, name) => {
    return !arr.hasOwnProperty(name) || !Array.isArray(arr[name])
      ? false
      : true;
  };

  static array_optional = (arr, name) => {
    if (!arr.hasOwnProperty(name)) return true;

    return Array.isArray(arr[name]);
  };

  static str = (str, name) => {
    return !str.hasOwnProperty(name) ||
      typeof str[name] !== "string" ||
      str[name] === ""
      ? false
      : true;
  };

  static str_optional = (str, name) => {
    if (!str.hasOwnProperty(name)) return true;
    return typeof str[name] === "string";
  };

  static exists = (data, name) => {
    return data.hasOwnProperty(name);
  };
}

const scan_config_input = (config) => {
  if (!scan.str(config, "title")) throw new Error("Config/Title not found");
  if (!scan.str(config, "type")) throw new Error("Config/type not found");
  if (!scan.str(config, "var")) throw new Error("Config/var not found");
  if (!scan.str_optional(config, "default"))
    throw new Error("Config/default not found");
  if (!scan.str_optional(config, "description"))
    throw new Error("Config/description not found");
  if (!scan.str_optional(config, "hint_image"))
    throw new Error("Config/hint_image not found");
  if (!scan.str_optional(config, "raw_value_on_empty"))
    throw new Error("Config/raw_value_on_empty not found");
  if (!scan.str_optional(config, "raw_value_on_fill"))
    throw new Error("Config/raw_value_on_fill not found");
};

const scan_config_select = (config) => {
  if (!scan.str(config, "title")) throw new Error("Config/Title not found");
  if (!scan.str(config, "type")) throw new Error("Config/type not found");
  if (!scan.str(config, "var")) throw new Error("Config/var not found");
  if (!scan.str(config, "default")) throw new Error("Config/default not found");
  if (!scan.str_optional(config, "description"))
    throw new Error("Config/description not found");
  if (!scan.str_optional(config, "hint_image"))
    throw new Error("Config/hint_image not found");

  if (!scan.array(config, "options"))
    throw new Error("Select/Options not found");

  const options = config.options;
  if (options.length < 2) throw new Error("Required more options");

  for (let i = 0; i < options.length; i++) {
    if (!scan.aObj(options[i])) throw new Error("Invalid Option object");

    if (!scan.str(options[i], "name"))
      throw new Error("Select/Options/Name not found");

    if (!scan.str(options[i], "value"))
      throw new Error("Select/Options/value not found");

    if (!scan.str_optional(options[i], "raw_value"))
      throw new Error("Select/Options/raw_value not found");
  }
};

const scan_config_color = (config) => {
  if (!scan.str(config, "title")) throw new Error("Config/Title not found");
  if (!scan.str(config, "type")) throw new Error("Config/type not found");
  if (!scan.str(config, "var")) throw new Error("Config/var not found");
  if (!scan.str(config, "default")) throw new Error("Config/default not found");
  if (!scan.str_optional(config, "description"))
    throw new Error("Config/description not found");
  if (!scan.str_optional(config, "hint_image"))
    throw new Error("Config/hint_image not found");
};

const scan_config = (data) => {
  let ret = {
    err: "",
    success: false,
  };

  try {
    if (!scan.obj(data, "base")) throw new Error("Basic Configs not found.");

    const base = data.base;

    if (!scan.str(base, "name")) {
      throw new Error("Basic/Name not defined");
    }

    if (!scan.str_optional(base, "logo")) {
      throw new Error("Basic/Logo not defined");
    }

    if (!scan.str_optional(base, "cover")) {
      throw new Error("Basic/Cover Photo not defined");
    }

    if (!scan.str_optional(base, "description")) {
      throw new Error("Basic/Description not defined");
    }

    if (!scan.str_optional(base, "repo")) {
      throw new Error("Basic/Repo Link not defined");
    }

    if (!scan.str_optional(base, "site")) {
      throw new Error("Basic/Website not defined");
    }

    if (!scan.array_optional(base, "credits")) {
      throw new Error("Basic/Name not defined");
    }

    const credits = base.credits;

    for (let i = 0; i < credits.length; i++) {
      if (!scan.aObj(credits[i])) throw new Error("Invalid Credits object");

      if (!scan.str(credits[i], "name"))
        throw new Error("Base/Credits/Name not defined");

      if (!scan.array_optional(credits[i], "contacts"))
        throw new Error("Base/Credits/Contacts invalid");

      if (scan.exists(credits[i], "contacts")) {
        const contacts = credits[i].contacts;

        for (let j = 0; j < contacts.length; j++) {
          if (!scan.aObj(contacts[j]))
            throw new Error("Invalid Base/Credits/Contacts object");

          if (!scan.str(contacts[j], "type"))
            throw new Error("Credit/Contacts/Type not found");

          if (!scan.str(contacts[j], "link"))
            throw new Error("Credit/Contacts/Link not found");
        }
      }
    }

    if (!scan.obj(data, "main")) throw new Error("Target configs not found");
    const main = data.main;

    if (!scan.str(main, "target_type"))
      throw new Error("Target/Type not defined");

    if (!scan.str(main, "target_url"))
      throw new Error("Target/Url not defined");

    if (main.target_type === "zip" && !scan.str(main, "target_file")) {
      throw new Error("Target/File not found");
    }

    if (!scan.array(data, "configs")) throw new Error("Configs not found");
    const configs = data.configs;

    if (configs.length < 1) throw new Error("No configs found");

    for (let i = 0; i < configs.length; i++) {
      if (!scan.aObj(configs[i])) throw new Error("Invalid Config object");

      switch (configs[i].type) {
        case "imageURL":
          scan_config_input(configs[i]);
          break;
        case "select":
          scan_config_select(configs[i]);
          break;
        case "color":
          scan_config_color(configs[i]);
          break;
        default:
          throw new Error("Invalid Type");
      }
    }

    ret.success = true;
    return ret;
  } catch (err) {
    ret.err = err.message;
    return ret;
  }
};

module.exports = {
  scan_config,
};
