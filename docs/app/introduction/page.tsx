const Introduction = () => {
  return (
    <div className="flex h-full flex-col items-start justify-start gap-6 px-16 py-6 ">
      <p className="w-full text-start font-bold text-4xl text-gray-300">
        Introduction
      </p>{' '}
      <p className="w-2/3 text-start">
        Welcome to FullAuth, a versatile authentication library designed to
        streamline user authentication and authorization across a variety of
        platforms. Whether you are developing web applications, Next.js
        projects, React applications, or React Native mobile apps, FullAuth
        offers a unified and secure authentication experience.
      </p>
      <p className="text-2xl font-semibold text-gray-300 mt-10">Features</p>
      <div className="w-2/3 h-full flex flex-col justify-start items-start gap-4 rounded-xl bg-[#1d1d1d] p-5">
        <p>
          <span className="font-semibold text-gray-300">
            Universal Authentication:
          </span>{' '}
          FullAuth simplifies the implementation of authentication workflows,
          ensuring a consistent experience across diverse platforms.
        </p>
        <p>
          <span className="font-semibold text-gray-300">
            Secure Authentication Methods:
          </span>{' '}
          Implement robust and secure authentication methods, enhancing the
          overall security of user accounts.
        </p>
        <p>
          <span className="font-semibold text-gray-300">
            Cross-Platform Compatibility:
          </span>{' '}
          Seamlessly integrate authentication features into both web and mobile
          applications.
        </p>
        <p>
          <span className="font-semibold text-gray-300">
            Next.js Integration:
          </span>{' '}
          Tailored support for Next.js applications, including server components
          and API route authentication.
        </p>
        <p>
          <span className="font-semibold text-gray-300">
            React Native Integration:
          </span>{' '}
          Tailored support for React Native / Expo applications.
        </p>
      </div>
    </div>
  );
};

export default Introduction;
