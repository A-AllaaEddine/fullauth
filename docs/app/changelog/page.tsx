const ChangeLog = () => {
  return (
    <div className="flex h-full  gap-2 px-16 py-6  pb-40">
      <div className="w-[calc(100%-16rem)] h-full flex flex-col justify-start items-start  gap-2 ">
        <p className="w-full text-start font-bold text-4xl text-gray-300">
          Changelog
        </p>
        <div className="w-full h-auto scroll-m-20 flex flex-col justify-start items-start gap-3 mt-10">
          <p className="text-start text-lg text-gray-300 font-semibold">
            v1.1.1
          </p>
          <p>React Native:</p>
          <p className=" h-8 ">
            - Add: `baseUrl` is now a REQUIRED argument in Session Provider,
            signIn and signOut functions (Set the fullauth backend url) .
          </p>
        </div>{' '}
        <div className="w-full h-auto scroll-m-20 flex flex-col justify-start items-start gap-3 mt-10">
          <p className="text-start text-lg text-gray-300 font-semibold">
            v1.0.2
          </p>
          <p className=" h-8 ">
            - Add: Optional `baseUrl` props to Session Provider in react native
            package (Helps with setting the backend url) .
          </p>
          <p className=" h-8 ">
            - Fix: Token callback `platform` prop now has correct types
            (web/mobile)
          </p>
        </div>
        <div className="w-full h-auto scroll-m-20 flex flex-col justify-start items-start gap-3 mt-10">
          <p className="text-start text-lg text-gray-300 font-semibold">
            v1.0.1
          </p>
          <p className=" h-8 ">
            - Add: token callback now has platform prop (web/mobile).
          </p>
        </div>
        <div className="w-full h-auto scroll-m-20 flex flex-col justify-start items-start gap-3 mt-10">
          <p className="text-start text-lg text-gray-300 font-semibold">
            v1.0.0
          </p>
          <p className=" h-8 ">- Reworked internal functions.</p>
          <p className=" h-8 ">- Add: Google Provider.</p>
          <p className=" h-8 ">
            - Fix: Session not getting refreshed after signin/out (web).
          </p>
          <p className=" h-8 ">- Add: Redirection after signing in.</p>
        </div>
      </div>
    </div>
  );
};

export default ChangeLog;
