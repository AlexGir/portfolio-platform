import { Section } from '../ui/section';
import { projects } from '@/content/projects';

export function Work() {
  return (
    <Section
      id="work"
      title="Projets"
      lead="Une sélection représentative. Les études de cas détaillées arrivent."
    >
      <ul className="space-y-6">
        {projects.map((project) => (
          <li
            key={project.slug}
            className="rounded-lg border border-border p-6 transition-colors hover:bg-surface"
          >
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h3 className="text-lg font-medium">
                {project.href ? (
                  <a
                    href={project.href}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-accent"
                  >
                    {project.title}
                  </a>
                ) : (
                  project.title
                )}
              </h3>
              <span className="text-sm text-muted">{project.year}</span>
            </div>
            <p className="mt-2 text-sm text-muted">{project.summary}</p>
            <p className="mt-3 text-sm text-fg/90">{project.description}</p>
            {project.outcome ? (
              <p className="mt-3 text-sm">
                <span className="font-medium">Résultat : </span>
                <span className="text-fg/90">{project.outcome}</span>
              </p>
            ) : null}
            <dl className="mt-4 flex flex-wrap gap-x-6 gap-y-1 text-xs text-muted">
              <div className="flex gap-1">
                <dt className="font-medium">Rôle :</dt>
                <dd>{project.role}</dd>
              </div>
              <div className="flex gap-1">
                <dt className="font-medium">Stack :</dt>
                <dd>{project.stack.join(', ')}</dd>
              </div>
            </dl>
          </li>
        ))}
      </ul>
    </Section>
  );
}
