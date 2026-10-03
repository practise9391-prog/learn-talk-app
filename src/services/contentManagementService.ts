// LearnTalk - Part 13 Content Management & Authoring Service
// Handles duplicate detection, prerequisite cycle validation, publishing checklist audits,
// AI draft validation, and content import/export pipelines.

import {
  ContentBlock,
  ContentRelationship,
  PublishingValidationReport,
  PublishingValidationCheck,
  ReusableLessonDraft,
} from '../types/contentManagement';
import { ManagedContentItem, ContentType } from '../types/admin';

export class ContentManagementService {
  // 1. Duplicate Detection Engine (Section 14 & 26)
  public detectDuplicates(
    candidate: { title: string; slug: string; type: ContentType; id?: string },
    existingItems: ManagedContentItem[]
  ): string[] {
    const warnings: string[] = [];
    const normTitle = candidate.title.toLowerCase().trim();
    const normSlug = candidate.slug.toLowerCase().trim();

    for (const item of existingItems) {
      if (candidate.id && item.id === candidate.id) continue;

      // Exact slug collision
      if (item.contentData?.slug && item.contentData.slug.toLowerCase().trim() === normSlug) {
        warnings.push(`Slug collision: "${candidate.slug}" is already used by "${item.title}" (${item.id}).`);
      }

      // Title similarity
      const itemTitleNorm = item.title.toLowerCase().trim();
      if (itemTitleNorm === normTitle && item.type === candidate.type) {
        warnings.push(`Duplicate title detected: A ${item.type} with the exact title "${item.title}" already exists (${item.id}).`);
      } else if (item.type === candidate.type && this.calculateTokenOverlap(normTitle, itemTitleNorm) > 0.8) {
        warnings.push(`High title similarity with existing ${item.type}: "${item.title}" (${item.id}). Please review to avoid confusion.`);
      }
    }

    return warnings;
  }

  private calculateTokenOverlap(strA: string, strB: string): number {
    const tokensA = new Set(strA.split(/\s+/).filter((t) => t.length > 2));
    const tokensB = new Set(strB.split(/\s+/).filter((t) => t.length > 2));
    if (tokensA.size === 0 || tokensB.size === 0) return 0;

    let overlap = 0;
    tokensA.forEach((token) => {
      if (tokensB.has(token)) overlap++;
    });

    return overlap / Math.max(tokensA.size, tokensB.size);
  }

  // 2. Prerequisite Dependency Graph & Cycle Detection (Sections 18 & 19)
  public detectPrerequisiteCycles(
    targetId: string,
    prerequisites: string[],
    allRelationships: ContentRelationship[]
  ): { hasCycle: boolean; cyclePath?: string[]; brokenPrereqs: string[] } {
    // Build adjacency graph: content -> prerequisites
    const graph: Record<string, string[]> = {};
    allRelationships.forEach((rel) => {
      if (rel.relationshipType === 'prerequisite_of') {
        if (!graph[rel.targetId]) graph[rel.targetId] = [];
        graph[rel.targetId].push(rel.sourceId);
      }
    });

    graph[targetId] = prerequisites;

    // DFS Cycle Detection
    const visited: Record<string, boolean> = {};
    const recStack: Record<string, boolean> = {};
    let cyclePath: string[] = [];

    const dfs = (node: string, currentPath: string[]): boolean => {
      visited[node] = true;
      recStack[node] = true;
      currentPath.push(node);

      const neighbors = graph[node] || [];
      for (const neighbor of neighbors) {
        if (!visited[neighbor]) {
          if (dfs(neighbor, currentPath)) return true;
        } else if (recStack[neighbor]) {
          cyclePath = [...currentPath, neighbor];
          return true;
        }
      }

      recStack[node] = false;
      currentPath.pop();
      return false;
    };

    const hasCycle = dfs(targetId, []);

    // Check for self-referential prerequisite
    if (prerequisites.includes(targetId)) {
      return { hasCycle: true, cyclePath: [targetId, targetId], brokenPrereqs: [targetId] };
    }

    return { hasCycle, cyclePath: hasCycle ? cyclePath : undefined, brokenPrereqs: [] };
  }

  // 3. Publishing Checklist Validator (Sections 9, 10, 43, 69)
  public validateForPublishing(lesson: ReusableLessonDraft): PublishingValidationReport {
    const checks: PublishingValidationCheck[] = [];
    const missingFields: string[] = [];

    // Check 1: Core Metadata
    if (!lesson.title || lesson.title.trim().length < 4) {
      missingFields.push('title');
      checks.push({ id: 'meta-title', label: 'Lesson Title', status: 'failed', message: 'Title must be at least 4 characters long.' });
    } else {
      checks.push({ id: 'meta-title', label: 'Lesson Title', status: 'passed', message: 'Title is complete.' });
    }

    if (!lesson.slug || lesson.slug.trim().length < 3) {
      missingFields.push('slug');
      checks.push({ id: 'meta-slug', label: 'URL Slug', status: 'failed', message: 'URL slug is required for stable navigation.' });
    } else {
      checks.push({ id: 'meta-slug', label: 'URL Slug', status: 'passed', message: 'Stable slug defined.' });
    }

    // Check 2: Learning Objectives
    if (!lesson.learningObjectives || lesson.learningObjectives.length === 0) {
      missingFields.push('learningObjectives');
      checks.push({ id: 'obj-defined', label: 'Learning Objectives', status: 'failed', message: 'At least one learning objective is required.' });
    } else {
      checks.push({ id: 'obj-defined', label: 'Learning Objectives', status: 'passed', message: `${lesson.learningObjectives.length} objective(s) specified.` });
    }

    // Check 3: Content Sections & Structure
    const hasIntro = lesson.sections.some((s) => s.name === 'introduction' && s.blocks.length > 0);
    const hasExplanation = lesson.sections.some((s) => s.name === 'explanation' && s.blocks.length > 0);
    const hasPractice = lesson.sections.some((s) => s.name === 'practice' && s.blocks.length > 0);

    if (!hasIntro) {
      checks.push({ id: 'sec-intro', label: 'Introduction Section', status: 'warning', message: 'No introduction section found.' });
    } else {
      checks.push({ id: 'sec-intro', label: 'Introduction Section', status: 'passed', message: 'Introduction content provided.' });
    }

    if (!hasExplanation) {
      missingFields.push('explanationSection');
      checks.push({ id: 'sec-expl', label: 'Explanation Section', status: 'failed', message: 'Core concept explanation block is required.' });
    } else {
      checks.push({ id: 'sec-expl', label: 'Explanation Section', status: 'passed', message: 'Explanation blocks verified.' });
    }

    if (!hasPractice) {
      checks.push({ id: 'sec-prac', label: 'Practice & Exercises', status: 'warning', message: 'Practice questions are recommended for interactive learning.' });
    } else {
      checks.push({ id: 'sec-prac', label: 'Practice & Exercises', status: 'passed', message: 'Practice exercises included.' });
    }

    // Check 4: Canonical Knowledge System Relationships
    const hasGrammarRel = lesson.relationships.some((r) => r.relationshipType === 'requires_grammar');
    const hasVocabRel = lesson.relationships.some((r) => r.relationshipType === 'teaches_vocabulary');

    if (!hasGrammarRel && !hasVocabRel) {
      checks.push({ id: 'rel-knowledge', label: 'Canonical Knowledge Links', status: 'warning', message: 'Lesson is not linked to any canonical grammar or vocabulary topics.' });
    } else {
      checks.push({ id: 'rel-knowledge', label: 'Canonical Knowledge Links', status: 'passed', message: 'Linked to canonical knowledge graph.' });
    }

    // Check 5: Audio / Media References
    const allBlocks = lesson.sections.flatMap((s) => s.blocks);
    const hasAudio = allBlocks.some((b) => b.type === 'audio' || b.metadata?.audioUrl);
    if (!hasAudio) {
      checks.push({ id: 'media-audio', label: 'Audio Pronunciation Guide', status: 'warning', message: 'No audio blocks attached. Dynamic TTS fallback will be active.' });
    } else {
      checks.push({ id: 'media-audio', label: 'Audio Pronunciation Guide', status: 'passed', message: 'Audio resources verified.' });
    }

    const failedCount = checks.filter((c) => c.status === 'failed').length;
    const warningCount = checks.filter((c) => c.status === 'warning').length;
    const score = Math.max(0, 100 - failedCount * 25 - warningCount * 10);

    return {
      isValid: failedCount === 0,
      score,
      checks,
      missingFields,
      duplicateWarnings: [],
      brokenReferences: [],
    };
  }

  // 4. AI Content Review & Educational Schema Validation (Sections 36–39)
  public validateAiDraft(draft: {
    type: ContentType;
    level: string;
    content: string;
  }): { isValid: boolean; issues: string[]; suggestions: string[] } {
    const issues: string[] = [];
    const suggestions: string[] = [];

    if (!draft.content || draft.content.trim().length < 20) {
      issues.push('AI draft content is too brief or empty.');
    }

    // Level consistency check
    if (draft.level === 'A1' || draft.level === 'A2') {
      const advancedJargon = /\b(paradigm|ubiquitous|ameliorate|juxtaposition|ephemeral|substantiate)\b/i;
      if (advancedJargon.test(draft.content)) {
        issues.push(`Draft contains complex C1/C2 vocabulary that exceeds beginner level (${draft.level}).`);
        suggestions.push('Simplify vocabulary to match basic CEFR standards.');
      }
    }

    return {
      isValid: issues.length === 0,
      issues,
      suggestions,
    };
  }

  // 5. Clean Structured Content Export (Section 57: Zero Learner Data Leakage)
  public exportSanitizedContentJson(items: ManagedContentItem[]): string {
    const sanitized = items.map((item) => ({
      id: item.id,
      title: item.title,
      type: item.type,
      level: item.level,
      version: item.version,
      status: item.status,
      summary: item.summary,
      contentData: item.contentData,
    }));

    return JSON.stringify(sanitized, null, 2);
  }

  // 6. Content Import Validator (Section 56)
  public validateImportJson(rawJson: string): {
    isValid: boolean;
    parsedCount: number;
    errors: string[];
    validItems: any[];
  } {
    const errors: string[] = [];
    let parsed: any[] = [];

    try {
      const data = JSON.parse(rawJson);
      if (!Array.isArray(data)) {
        return { isValid: false, parsedCount: 0, errors: ['Import file must be a JSON array of content items.'], validItems: [] };
      }
      parsed = data;
    } catch (e: any) {
      return { isValid: false, parsedCount: 0, errors: [`JSON parse error: ${e.message}`], validItems: [] };
    }

    const validItems: any[] = [];
    parsed.forEach((item, idx) => {
      if (!item.title || !item.type) {
        errors.push(`Item at index ${idx} is missing required 'title' or 'type' properties.`);
      } else {
        validItems.push(item);
      }
    });

    return {
      isValid: errors.length === 0,
      parsedCount: validItems.length,
      errors,
      validItems,
    };
  }
}

export const contentManagementService = new ContentManagementService();
