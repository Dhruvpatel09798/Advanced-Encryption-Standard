async function encryptMessage() {
    const message = document.getElementById("messageInput").value;
    const key = await generateKey();
  
    const encryptedMessage = await encryptString(message, key);
    document.getElementById("output").value = encryptedMessage;
  }
  
  async function decryptMessage() {
    const encryptedMessage = document.getElementById("output").value;
    const key = await generateKey();
  
    const decryptedMessage = await decryptString(encryptedMessage, key);
    document.getElementById("messageInput").value = decryptedMessage;
  }
  
  async function generateKey() {
    return window.crypto.subtle.generateKey(
      {
        name: "AES-GCM",
        length: 256,
      },
      true,
      ["encrypt", "decrypt"]
    );
  }
  
  async function encryptString(message, key) {
    const encodedMessage = new TextEncoder().encode(message);
    const iv = window.crypto.getRandomValues(new Uint8Array(12));
  
    const encryptedData = await window.crypto.subtle.encrypt(
      {
        name: "AES-GCM",
        iv: iv,
      },
      key,
      encodedMessage
    );
  
    const encryptedArray = new Uint8Array(encryptedData);
    const encryptedHex = Array.from(encryptedArray)
      .map((byte) => byte.toString(16).padStart(2, "0"))
      .join("");
  
    const ivHex = Array.from(iv)
      .map((byte) => byte.toString(16).padStart(2, "0"))
      .join("");
  
    return ivHex + encryptedHex;
  }
  
  async function decryptString(encryptedMessage, key) {
    if (!encryptedMessage || !key) {
      console.error("Invalid input or key provided for decryption.");
      return "";
    }
  
    try {
      const ivHex = encryptedMessage.substring(0, 24);
      const encryptedHex = encryptedMessage.substring(24);
  
      const iv = hexStringToUint8Array(ivHex);
      const encryptedArray = hexStringToUint8Array(encryptedHex);
  
      const decryptedData = await window.crypto.subtle.decrypt(
        {
          name: "AES-GCM",
          iv: iv,
        },
        key,
        encryptedArray
      );
  
      return new TextDecoder().decode(decryptedData);
    } catch (error) {
      console.error("Decryption failed:", error);
      return "";
    }
  }
  
  function hexStringToUint8Array(hexString) {
    const arrayBuffer = new Uint8Array(
      hexString.match(/.{1,2}/g).map((byte) => parseInt(byte, 16))
    );
    return arrayBuffer;
  }
  