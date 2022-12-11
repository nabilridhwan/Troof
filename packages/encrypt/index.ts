import NodeRSA from "node-rsa";

export interface GeneratedKeyPair {
	private: string;
	public: string;
}

export namespace Encryption {
	const key = new NodeRSA();

	export async function generateKeyPair(): Promise<GeneratedKeyPair> {
		const k = key.generateKeyPair();

		const priv = k.exportKey("private");
		const pub = k.exportKey("public");

		return {
			private: priv,
			public: pub,
		};
	}

	export function getPrivateKey(k: GeneratedKeyPair) {
		return k.private;
	}

	export function getPublicKey(k: GeneratedKeyPair) {
		return k.public;
	}

	export function encryptWithPublic(data: string, publicKey: string) {
		// console.log("encryptWithPublic", data, publicKey);
		return new NodeRSA().importKey(publicKey, "public").encrypt(data, "base64");
	}

	export function encryptWithPrivate(data: string, privateKey: string) {
		// console.log("encryptWithPrivate", data, privateKey);
		return new NodeRSA()
			.importKey(privateKey, "private")
			.encryptPrivate(data, "base64");
	}

	export function decryptWithPublic(data: string, publicKey: string) {
		// console.log("decryptWithPublic", data, publicKey);
		return new NodeRSA()
			.importKey(publicKey, "public")
			.decryptPublic(data, "utf8");
	}

	export function decryptWithPrivate(data: string, privateKey: string) {
		// console.log("decryptWithPrivate", data, privateKey);
		return new NodeRSA().importKey(privateKey, "private").decrypt(data, "utf8");
	}
}
