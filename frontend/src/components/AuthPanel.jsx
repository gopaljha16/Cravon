export function AuthPanel({ mode, auth, notice, onModeChange, onAuthChange, onSubmit }) {
  return (
    <form className="authPanel" onSubmit={onSubmit}>
      <div>
        <h2>{mode === "signin" ? "Welcome back" : "Create your Cravon account"}</h2>
        <p>Use admin as username for admin access, or sign up as a customer.</p>
      </div>
      {notice && <div className="notice">{notice}</div>}
      <div className="tabs">
        <button type="button" className={mode === "signin" ? "selected" : ""} onClick={() => onModeChange("signin")}>Sign in</button>
        <button type="button" className={mode === "signup" ? "selected" : ""} onClick={() => onModeChange("signup")}>Sign up</button>
      </div>
      <input placeholder="Username" value={auth.username} onChange={(e) => onAuthChange({ ...auth, username: e.target.value })} />
      <input placeholder="Password" type="password" value={auth.password} onChange={(e) => onAuthChange({ ...auth, password: e.target.value })} />
      {mode === "signup" && (
        <>
          <input placeholder="Email" value={auth.email} onChange={(e) => onAuthChange({ ...auth, email: e.target.value })} />
          <input placeholder="Mobile" value={auth.mobile} onChange={(e) => onAuthChange({ ...auth, mobile: e.target.value })} />
          <input placeholder="Address" value={auth.address} onChange={(e) => onAuthChange({ ...auth, address: e.target.value })} />
        </>
      )}
      <button className="primary">{mode === "signin" ? "Sign in" : "Create account"}</button>
    </form>
  );
}
