import type { JSX } from "react";
import LoadingSpinner from "../../components/LoadingSpinner";
import useArticles from "../../hooks/Articles/useArticles";
import { MoreButton } from "../../styles/common.style";
import { socialMediaLinks } from "../../utils/data";
import hljs from "../../utils/hljsLangs";
import ArticleCards from "../Articles/components/ArticleCards";
import {
    FooterWrapper,
    HomeEditor,
    HomeIntroText,
    HomePageWrapper,
    HomeProjects,
    TitleHighlight,
} from "./Home.style";

const Home = (): JSX.Element => {
    const { data } = useArticles("projects");
    const projects = data
        ?.sort((a, b) =>
            new Date(a.createdAt) > new Date(b.createdAt) ? -1 : 1,
        )
        .slice(0, 4);

    const codeText =
        'const aboutMe = {\n   background: "6 years in e-Sports",\n   specialty:  "web development",\n   favorites: ["Typescript", "Go"],\n}';

    const formatCode = (text: string): string => {
        return hljs.highlight(text, { language: "javascript" }).value;
    };

    return (
        <>
            <HomePageWrapper>
                <section className="home-top">
                    <HomeIntroText>
                        <p className="home-top-text">Hello, I'm</p>
                        <h3 className="home-top-title">
                            <div>
                                <TitleHighlight $item={1}>E</TitleHighlight>
                                <TitleHighlight $item={2}>u</TitleHighlight>
                                <TitleHighlight $item={3}>g</TitleHighlight>
                                <TitleHighlight $item={4}>e</TitleHighlight>
                                <TitleHighlight $item={5}>n</TitleHighlight>
                                <TitleHighlight $item={6}>e</TitleHighlight>
                            </div>
                            <span>&nbsp;</span>
                            <div>
                                <TitleHighlight $item={7}>S</TitleHighlight>
                                <TitleHighlight $item={8}>h</TitleHighlight>
                                <TitleHighlight $item={9}>u</TitleHighlight>
                                <TitleHighlight $item={10}>m</TitleHighlight>
                                <TitleHighlight $item={11}>i</TitleHighlight>
                                <TitleHighlight $item={12}>l</TitleHighlight>
                                <TitleHighlight $item={13}>i</TitleHighlight>
                                <TitleHighlight $item={14}>n</TitleHighlight>
                            </div>
                        </h3>
                        <p className="home-bottom-text">
                            a Software Engineer who likes to make life simpler
                        </p>
                        <div className="home-top-links">
                            {socialMediaLinks.map((item, index) => {
                                return (
                                    <a
                                        key={`link-${index}`}
                                        className="address-link"
                                        href={item.link}
                                        rel="noreferrer"
                                        aria-label={item.name}
                                    >
                                        {item.image}
                                    </a>
                                );
                            })}
                        </div>
                    </HomeIntroText>
                    <HomeEditor>
                        <div className="home-editor-header">
                            <div className="red-circle"></div>
                            <div className="yellow-circle"></div>
                            <div className="green-circle"></div>
                        </div>
                        <div className="home-editor-body">
                            <div className="home-editor-numbers">
                                <div>1</div>
                                <div>2</div>
                                <div>3</div>
                                <div>4</div>
                                <div>5</div>
                            </div>
                            <pre
                                className="home-editor-code"
                                dangerouslySetInnerHTML={{
                                    __html: formatCode(codeText),
                                }}
                            ></pre>
                        </div>
                    </HomeEditor>
                </section>
                <HomeProjects>
                    <h3 className="projects-title">PROJECTS</h3>
                    {!projects ? (
                        <LoadingSpinner flexGrow={1} height="auto" />
                    ) : (
                        <div className="projects-wrapper">
                            <ArticleCards
                                type={"projects"}
                                articleCards={projects}
                            />
                        </div>
                    )}
                    <MoreButton to="/projects" className="more-btn">
                        More projects
                    </MoreButton>
                </HomeProjects>
            </HomePageWrapper>
            <FooterWrapper>
                <p className="footer-name">Eugene Shumilin 2025</p>
            </FooterWrapper>
        </>
    );
};

export default Home;
