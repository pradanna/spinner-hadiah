import { useEffect } from "react";
import { Head, useForm } from "@inertiajs/react";

export default function Login({ status }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: "",
        password: "",
        remember: false,
    });

    useEffect(() => {
        return () => {
            reset("password");
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();
        post(route("login"));
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-700 flex items-center justify-center p-4">
            <Head title="Admin Login" />

            <div className="bg-white max-w-md w-full rounded-3xl shadow-2xl overflow-hidden">
                {/* Header Card */}
                <div className="bg-gray-900 p-6 text-center text-white">
                    <h1 className="text-3xl font-extrabold tracking-tight mb-2">
                        Admin Panel
                    </h1>
                    <p className="text-gray-400 text-sm">
                        Masuk untuk mengelola hadiah dan pemenang.
                    </p>
                </div>

                {/* Form Section */}
                <form onSubmit={submit} className="p-8">
                    {/* Status Message (Misal: Password direset) */}
                    {status && (
                        <div className="mb-4 font-medium text-sm text-green-600">
                            {status}
                        </div>
                    )}

                    {/* Input Email */}
                    <div className="mb-5">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Email Admin
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={data.email}
                            onChange={(e) => setData("email", e.target.value)}
                            className={`w-full px-4 py-3 rounded-xl border focus:ring-2 transition-colors ${
                                errors.email
                                    ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                                    : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                            }`}
                            placeholder="admin@domain.com"
                            autoComplete="username"
                        />
                        {errors.email && (
                            <div className="text-red-500 text-xs mt-1 font-medium">
                                {errors.email}
                            </div>
                        )}
                    </div>

                    {/* Input Password */}
                    <div className="mb-6">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Password
                        </label>
                        <input
                            type="password"
                            name="password"
                            value={data.password}
                            onChange={(e) =>
                                setData("password", e.target.value)
                            }
                            className={`w-full px-4 py-3 rounded-xl border focus:ring-2 transition-colors ${
                                errors.password
                                    ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                                    : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                            }`}
                            placeholder="••••••••"
                            autoComplete="current-password"
                        />
                        {errors.password && (
                            <div className="text-red-500 text-xs mt-1 font-medium">
                                {errors.password}
                            </div>
                        )}
                    </div>

                    {/* Remember Me */}
                    <div className="mb-6 flex items-center">
                        <input
                            id="remember"
                            type="checkbox"
                            name="remember"
                            checked={data.remember}
                            onChange={(e) =>
                                setData("remember", e.target.checked)
                            }
                            className="rounded border-gray-300 text-blue-600 shadow-sm focus:ring-blue-500 w-4 h-4"
                        />
                        <label
                            htmlFor="remember"
                            className="ml-2 text-sm text-gray-600 font-medium"
                        >
                            Ingat saya
                        </label>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full bg-gray-900 hover:bg-black text-white font-bold py-4 rounded-xl shadow-lg transform transition active:scale-95 disabled:opacity-50 text-lg"
                    >
                        {processing ? "Memeriksa..." : "Masuk"}
                    </button>
                </form>
            </div>
        </div>
    );
}
