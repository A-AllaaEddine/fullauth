declare const useSession: () => {
    status: string;
    session: import("@fullauth/core").Session | null;
    update: (data?: any) => Promise<import("./context").Update>;
};
export default useSession;
