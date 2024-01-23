declare const useSession: () => {
    status: string;
    session: import("@lazyauth/core").Session | null;
    update: (data?: any) => Promise<import("./context").Update>;
};
export default useSession;
