import React from 'react';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-links">
                    <div>
                        <h3>关于我们</h3>
                        <a href="/about">集团简介</a>
                        <a href="/contact">联系我们</a>
                    </div>
                    <div>
                        <h3>客户服务</h3>
                        <a href="#">客服热线：0351-7021781</a>
                    </div>
                </div>
                <div className="copyright">
                    <p>版权所有©️ 河北工程大学</p>
                    <p>冀公网安备 3415535123525号 | 工信部备案号：冀ICP备312314115号-5</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;    